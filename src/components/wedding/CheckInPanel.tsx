import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { decodeBarcodeData, formatDateTime } from '@/lib/barcode-utils';
import { BarcodeScanner } from './BarcodeScanner';
import { Button } from '@/components/ui/button';

interface CheckedInGuest {
  id: string;
  name: string;
  timestamp: string;
}

export function CheckInPanel() {
  const [isScanning, setIsScanning] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkedInGuests, setCheckedInGuests] = useState<CheckedInGuest[]>([]);
  const [lastCheckedIn, setLastCheckedIn] = useState<CheckedInGuest | null>(null);
  const [guestNotFound, setGuestNotFound] = useState<string | null>(null);

  useEffect(() => {
    loadCheckedInGuests();
  }, []);

  const loadCheckedInGuests = async () => {
    try {
      const { data, error } = await supabase
        .from('attendance')
        .select(`
          id,
          guest_id,
          checked_in_at,
          guests(name)
        `)
        .order('checked_in_at', { ascending: false });

      if (error) throw error;

      setCheckedInGuests(
        data.map((item: any) => ({
          id: item.id,
          name: item.guests.name,
          timestamp: item.checked_in_at,
        }))
      );
    } catch (error) {
      console.error('Error loading checked-in guests:', error);
    }
  };

  const handleScan = async (scannedData: string) => {
    setIsProcessing(true);
    setGuestNotFound(null);

    try {
      // Try to decode QR code data (format: GUEST|BARCODE_ID|NAME|TIMESTAMP)
      const decoded = decodeBarcodeData(scannedData);
      
      // Extract the barcode_id: from QR decode or use raw scanned text
      const barcodeId = decoded ? decoded.guestId : scannedData;

      // Always look up the guest by barcode_id in database
      const { data: guestData, error: lookupError } = await supabase
        .from('guests')
        .select('id, name')
        .eq('barcode_id', barcodeId)
        .single();

      if (lookupError || !guestData) {
        setGuestNotFound(barcodeId);
        toast.error(`Tamu tidak ditemukan (ID: ${barcodeId})`);
        setIsProcessing(false);
        return;
      }

      const guestId = guestData.id;
      const guestName = guestData.name;

      // Check if already checked in today
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data: existingCheckin } = await supabase
        .from('attendance')
        .select('id')
        .eq('guest_id', guestId)
        .gte('checked_in_at', today.toISOString())
        .maybeSingle();

      if (existingCheckin) {
        toast.info(`${guestName} sudah tercatat hadir hari ini`);
        setIsProcessing(false);
        return;
      }

      // Record attendance
      const { error: attendanceError } = await supabase
        .from('attendance')
        .insert([
          {
            guest_id: guestId,
            checked_in_at: new Date().toISOString(),
          },
        ]);

      if (attendanceError) throw attendanceError;

      const newCheckin: CheckedInGuest = {
        id: guestId,
        name: guestName,
        timestamp: new Date().toISOString(),
      };

      setLastCheckedIn(newCheckin);
      setCheckedInGuests((prev) => [newCheckin, ...prev]);
      toast.success(`${guestName} berhasil check-in!`);

      // Play success sound
      playSuccessSound();
    } catch (error) {
      console.error('Error processing scan:', error);
      toast.error('Gagal memproses scan');
    } finally {
      setIsProcessing(false);
    }
  };

  const playSuccessSound = () => {
    try {
      const audio = new Audio(
        'data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA=='
      );
      audio.play().catch(() => {
        // Silent fail if audio can't play
      });
    } catch {
      // Silent fail
    }
  };

  const exportAttendanceCSV = () => {
    if (checkedInGuests.length === 0) {
      toast.error('Belum ada data kehadiran');
      return;
    }

    const headers = ['No', 'Nama Tamu', 'Waktu Check-in'];
    const rows = checkedInGuests.map((guest, index) => [
      index + 1,
      guest.name,
      formatDateTime(guest.timestamp),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `kehadiran_${new Date().getTime()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Laporan kehadiran berhasil di-download');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Scanner Section */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-sage/20">
          <h2 className="text-2xl font-semibold text-sage mb-4">Scan Kehadiran</h2>
          <BarcodeScanner
            onScan={handleScan}
            isLoading={isProcessing}
            onError={(error) => {
              setGuestNotFound(error);
            }}
          />
        </div>

        {/* Last Check-in Alert */}
        {lastCheckedIn && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg animate-in slide-in-from-top">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-green-900 mb-1">
                  Check-in Berhasil!
                </h3>
                <p className="text-sm text-green-700 mb-1">
                  <span className="font-semibold">{lastCheckedIn.name}</span> berhasil
                  terdaftar hadir
                </p>
                <p className="text-xs text-green-600">
                  {formatDateTime(lastCheckedIn.timestamp)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Not Found Alert */}
        {guestNotFound && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg animate-in slide-in-from-top">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900 mb-1">Tamu Tidak Ditemukan</h3>
                <p className="text-sm text-red-700">
                  Barcode: <span className="font-mono">{guestNotFound}</span>
                </p>
                <p className="text-xs text-red-600 mt-1">
                  Pastikan barcode terdaftar di sistem
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Statistics Section */}
      <div className="space-y-6">
        {/* Summary */}
        <div className="bg-gradient-to-br from-sage/10 to-sage/5 p-6 rounded-2xl border border-sage/20">
          <div className="text-center">
            <div className="text-5xl font-bold text-sage mb-2">
              {checkedInGuests.length}
            </div>
            <p className="text-gray-600">Tamu Telah Hadir</p>
          </div>
        </div>

        {/* Export Button */}
        <Button
          onClick={exportAttendanceCSV}
          disabled={checkedInGuests.length === 0}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          Download Laporan
        </Button>

        {/* Recent Check-ins */}
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-sage/20">
          <h3 className="font-semibold text-lg text-sage mb-4">Tamu Terakhir Hadir</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {checkedInGuests.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">
                Belum ada check-in
              </p>
            ) : (
              checkedInGuests.slice(0, 10).map((guest, index) => (
                <div
                  key={guest.id}
                  className="flex items-start justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {index + 1}. {guest.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {formatDateTime(guest.timestamp)}
                    </p>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
