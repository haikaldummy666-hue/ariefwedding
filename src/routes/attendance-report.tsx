import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useSearch } from "@tanstack/react-router";
import { Navigate } from "@tanstack/react-router";
import { Loader2, Download, Eye, Filter } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { formatDateTime } from "@/lib/barcode-utils";
import { Reveal } from "@/components/wedding/Reveal";
import { Button } from "@/components/ui/button";

const reportSearchSchema = z.object({
  admin: z.string().optional(),
});

export const Route = createFileRoute("/attendance-report")({
  component: AttendanceReportPage,
  validateSearch: (search) => reportSearchSchema.parse(search),
});

interface AttendanceRecord {
  id: string;
  guest_id: string;
  name: string;
  checked_in_at: string;
  status: string;
  notes: string | null;
}

function AttendanceReportPage() {
  const search = useSearch({ from: "/attendance-report" }) as { admin?: string };
  const isAdmin = search.admin === "secret";
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [allGuests, setAllGuests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'attended' | 'absent'>('all');

  useEffect(() => {
    if (!isAdmin) return;
    loadData();
  }, [isAdmin]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      // Load all guests
      const { data: guestsData, error: guestsError } = await supabase
        .from('guests')
        .select('*')
        .order('created_at', { ascending: false });

      if (guestsError) throw guestsError;
      setAllGuests(guestsData || []);

      // Load attendance records
      const { data: attendanceData, error: attendanceError } = await supabase
        .from('attendance')
        .select(`
          id,
          guest_id,
          checked_in_at,
          guests(name, status, notes)
        `)
        .order('checked_in_at', { ascending: false });

      if (attendanceError) throw attendanceError;

      const formattedData = (attendanceData || []).map((item: any) => ({
        id: item.id,
        guest_id: item.guest_id,
        name: item.guests.name,
        checked_in_at: item.checked_in_at,
        status: item.guests.status,
        notes: item.guests.notes,
      }));

      setAttendanceData(formattedData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Gagal memuat data');
    } finally {
      setIsLoading(false);
    }
  };

  const getFilteredData = () => {
    const attendedIds = new Set(attendanceData.map((a) => a.guest_id));

    if (filterStatus === 'attended') {
      return attendanceData;
    } else if (filterStatus === 'absent') {
      return allGuests
        .filter((g) => !attendedIds.has(g.id))
        .map((g) => ({
          id: '',
          guest_id: g.id,
          name: g.name,
          checked_in_at: null,
          status: g.status,
          notes: g.notes,
        }));
    }

    // Show all with attendance info
    return allGuests.map((g) => {
      const attended = attendanceData.find((a) => a.guest_id === g.id);
      return {
        id: attended?.id || '',
        guest_id: g.id,
        name: g.name,
        checked_in_at: attended?.checked_in_at || null,
        status: g.status,
        notes: g.notes,
      };
    });
  };

  const exportToCSV = () => {
    const filteredData = getFilteredData();

    const headers = ['No', 'Nama Tamu', 'Status Kehadiran', 'Waktu Check-in', 'Status Tamu', 'Catatan'];
    const rows = filteredData.map((guest, index) => [
      index + 1,
      guest.name,
      guest.checked_in_at ? 'Hadir' : 'Tidak Hadir',
      guest.checked_in_at ? formatDateTime(guest.checked_in_at) : '-',
      guest.status || '-',
      guest.notes || '-',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `laporan-kehadiran-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Laporan berhasil di-download');
  };

  const exportToGoogleSheets = () => {
    const filteredData = getFilteredData();
    const headers = ['No', 'Nama Tamu', 'Status Kehadiran', 'Waktu Check-in', 'Status Tamu', 'Catatan'];
    
    let csvContent = headers.join('\t') + '\n';
    csvContent += filteredData
      .map((guest, index) => [
        index + 1,
        guest.name,
        guest.checked_in_at ? 'Hadir' : 'Tidak Hadir',
        guest.checked_in_at ? formatDateTime(guest.checked_in_at) : '-',
        guest.status || '-',
        guest.notes || '-',
      ].join('\t'))
      .join('\n');

    const encodedData = encodeURIComponent(csvContent);
    const url = `https://docs.google.com/spreadsheets/d/e/2PACX-1vT1_7BwO2YZ1i3TqMEYqTtPdLGPgVnuGpGLrKQjB5Wy2OZ-Z2D1c1/importss?paste=true&data=${encodedData}`;
    
    toast.info('Panduan: Salin data ke Google Sheets secara manual atau gunakan import');
    exportToCSV();
  };

  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  const filteredData = getFilteredData();
  const attendedCount = attendanceData.length;
  const absentCount = allGuests.length - attendedCount;
  const attendanceRate = allGuests.length > 0 
    ? Math.round((attendedCount / allGuests.length) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-cream px-6 py-20">
      <Reveal>
        <div className="text-center mb-12">
          <h1 className="font-script text-5xl text-sage mb-2">Laporan Kehadiran</h1>
          <p className="text-sm tracking-widest text-foreground/50 uppercase">
            Data Verifikasi Kehadiran Tamu
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-xl border border-sage/20 shadow-md">
              <p className="text-sm text-gray-600 mb-2">Total Tamu</p>
              <p className="text-3xl font-bold text-sage">{allGuests.length}</p>
            </div>
            <div className="bg-green-50 p-6 rounded-xl border border-green-200 shadow-md">
              <p className="text-sm text-green-700 mb-2">Telah Hadir</p>
              <p className="text-3xl font-bold text-green-600">{attendedCount}</p>
            </div>
            <div className="bg-red-50 p-6 rounded-xl border border-red-200 shadow-md">
              <p className="text-sm text-red-700 mb-2">Belum Hadir</p>
              <p className="text-3xl font-bold text-red-600">{absentCount}</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 shadow-md">
              <p className="text-sm text-blue-700 mb-2">Tingkat Kehadiran</p>
              <p className="text-3xl font-bold text-blue-600">{attendanceRate}%</p>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-sage/20 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
              <div className="flex gap-2">
                <Button
                  onClick={() => setFilterStatus('all')}
                  variant={filterStatus === 'all' ? 'default' : 'outline'}
                  className={filterStatus === 'all' ? 'bg-sage hover:bg-sage/90' : ''}
                >
                  Semua ({allGuests.length})
                </Button>
                <Button
                  onClick={() => setFilterStatus('attended')}
                  variant={filterStatus === 'attended' ? 'default' : 'outline'}
                  className={filterStatus === 'attended' ? 'bg-green-600 hover:bg-green-700' : ''}
                >
                  Hadir ({attendedCount})
                </Button>
                <Button
                  onClick={() => setFilterStatus('absent')}
                  variant={filterStatus === 'absent' ? 'default' : 'outline'}
                  className={filterStatus === 'absent' ? 'bg-red-600 hover:bg-red-700' : ''}
                >
                  Tidak Hadir ({absentCount})
                </Button>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button onClick={exportToCSV} className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700">
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white rounded-2xl shadow-xl border border-sage/20 overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 text-sage animate-spin" />
              </div>
            ) : filteredData.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Tidak ada data untuk ditampilkan</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-sage/10 border-b border-sage/20">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">No</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Nama Tamu</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Waktu Check-in</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Catatan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredData.map((guest, index) => (
                      <tr key={guest.id || guest.guest_id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-600">{index + 1}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{guest.name}</td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              guest.checked_in_at
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {guest.checked_in_at ? '✓ Hadir' : '✗ Tidak Hadir'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {guest.checked_in_at ? formatDateTime(guest.checked_in_at) : '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{guest.notes || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </Reveal>
    </div>
  );
}
