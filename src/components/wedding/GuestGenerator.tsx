import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Loader2, Download, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { generateBarcodeId, createBarcodeData } from '@/lib/barcode-utils';
import { BarcodeDisplay, QRCodeDisplay } from './BarcodeGenerator';
import { Button } from '@/components/ui/button';

const guestFormSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  notes: z.string().optional(),
});

type GuestFormData = z.infer<typeof guestFormSchema>;

interface GeneratedGuest {
  id: string;
  name: string;
  barcode_id: string;
  barcode_data: string;
}

export function GuestGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedGuests, setGeneratedGuests] = useState<GeneratedGuest[]>([]);
  const [showForm, setShowForm] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GuestFormData>({
    resolver: zodResolver(guestFormSchema),
  });

  const onSubmit = async (data: GuestFormData) => {
    setIsLoading(true);
    try {
      const barcodeId = generateBarcodeId();
      const barcodeData = createBarcodeData(barcodeId, data.name);

      const { data: guest, error } = await supabase
        .from('guests')
        .insert([
          {
            name: data.name,
            barcode_id: barcodeId,
            barcode_data: barcodeData,
            notes: data.notes || null,
            status: 'invited',
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setGeneratedGuests((prev) => [
        ...prev,
        {
          id: guest.id,
          name: guest.name,
          barcode_id: guest.barcode_id,
          barcode_data: guest.barcode_data,
        },
      ]);

      toast.success(`Tamu "${data.name}" berhasil ditambahkan`);
      reset();
    } catch (error: any) {
      console.error('Error generating guest:', error);
      toast.error(`Gagal menambahkan tamu: ${error.message || 'Terjadi kesalahan'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadBarcodeImage = (guest: GeneratedGuest) => {
    const svg = document.querySelector(`svg[data-guest-id="${guest.id}"]`) as SVGElement;
    if (svg) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const svgData = new XMLSerializer().serializeToString(svg);
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = `barcode_${guest.name.replace(/\s+/g, '_')}.png`;
        link.click();
      };
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }
  };

  const exportAllAsCSV = () => {
    if (generatedGuests.length === 0) {
      toast.error('Tidak ada tamu untuk di-export');
      return;
    }

    const headers = ['No', 'Nama Tamu', 'Barcode ID', 'Status', 'Tanggal Dibuat'];
    const rows = generatedGuests.map((guest, index) => [
      index + 1,
      guest.name,
      guest.barcode_id,
      'Belum Hadir',
      new Date().toLocaleDateString('id-ID'),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `daftar_tamu_${new Date().getTime()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('CSV berhasil di-download');
  };

  return (
    <div className="space-y-8">
      {/* Form Input */}
      {showForm && (
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-sage/20">
          <h3 className="font-semibold text-lg text-sage mb-4">Tambah Tamu Baru</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                Nama Tamu
              </label>
              <input
                id="name"
                type="text"
                placeholder="Contoh: Bpk. Jajang & Keluarga"
                {...register('name')}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sage/30"
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="notes" className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                Catatan (Opsional)
              </label>
              <textarea
                id="notes"
                placeholder="Contoh: VIP, Keluarga dekat, dll"
                {...register('notes')}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sage/30"
                rows={2}
              />
            </div>

            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-sage hover:bg-sage/90"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Menambahkan...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Tamu
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
              >
                Tutup Form
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Generated Guests Display */}
      {generatedGuests.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg text-sage">
              Tamu Terdaftar ({generatedGuests.length})
            </h3>
            <div className="flex gap-2">
              <Button
                onClick={() => setShowForm(!showForm)}
                variant="outline"
              >
                <Plus className="w-4 h-4 mr-2" />
                {showForm ? 'Tutup' : 'Tambah Tamu'}
              </Button>
              <Button
                onClick={exportAllAsCSV}
                className="bg-green-600 hover:bg-green-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {generatedGuests.map((guest) => (
              <div
                key={guest.id}
                className="bg-white p-4 rounded-xl border border-sage/20 shadow-md"
              >
                <div className="mb-4">
                  <h4 className="font-semibold text-sage mb-1">{guest.name}</h4>
                  <p className="text-xs text-gray-500">ID: {guest.barcode_id}</p>
                </div>

                {/* Barcode Display */}
                <div className="mb-4 bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 mb-2 text-center">Barcode:</p>
                  <div data-guest-id={guest.id} className="flex justify-center">
                    <BarcodeDisplay
                      value={guest.barcode_id}
                      width={1.5}
                      height={60}
                      displayValue={false}
                    />
                  </div>
                </div>

                {/* QR Code Display */}
                <div className="mb-4 bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 mb-2 text-center">QR Code:</p>
                  <QRCodeDisplay value={guest.barcode_data} size={150} />
                </div>

                <Button
                  onClick={() => downloadBarcodeImage(guest)}
                  variant="outline"
                  className="w-full text-xs"
                >
                  <Download className="w-3 h-3 mr-1" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {generatedGuests.length === 0 && !showForm && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Belum ada tamu yang ditambahkan</p>
          <Button onClick={() => setShowForm(true)} className="bg-sage hover:bg-sage/90">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Tamu Pertama
          </Button>
        </div>
      )}
    </div>
  );
}
