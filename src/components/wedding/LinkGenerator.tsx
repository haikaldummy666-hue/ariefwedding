import { useState } from "react";
import { Copy, Check, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";

export function LinkGenerator() {
  const [guestName, setGuestName] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = () => {
    if (!guestName.trim()) {
      toast.error("Masukkan nama tamu terlebih dahulu");
      return;
    }
    const baseUrl = window.location.origin;
    const encodedName = encodeURIComponent(guestName.trim());
    const link = `${baseUrl}?to=${encodedName}&v=1`;
    setGeneratedLink(link);
    setCopied(false);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      toast.success("Link berhasil disalin!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Gagal menyalin link");
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-sage/20 max-w-md mx-auto my-10">
      <div className="flex items-center gap-2 mb-4">
        <LinkIcon className="text-sage w-5 h-5" />
        <h3 className="font-semibold text-lg text-sage">Generate Link Undangan</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="guestName" className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
            Nama Tamu
          </label>
          <input
            id="guestName"
            type="text"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder="Contoh: Bpk. Jajang & Keluarga"
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sage/30 transition-all"
            onKeyDown={(e) => e.key === "Enter" && generate()}
          />
        </div>

        <button
          onClick={generate}
          className="w-full bg-sage text-white py-2 rounded-lg font-medium hover:bg-sage/90 transition-colors shadow-md"
        >
          Generate Link
        </button>

        {generatedLink && (
          <div className="mt-6 p-3 bg-cream rounded-lg border border-gold/20 break-all">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">Link Hasil Generate:</p>
            <p className="text-sm text-sage font-mono mb-3">{generatedLink}</p>
            <button
              onClick={copyToClipboard}
              className="flex items-center justify-center gap-2 w-full bg-white border border-sage text-sage py-1.5 rounded-md text-sm font-medium hover:bg-sage hover:text-white transition-all"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? "Tersalin!" : "Salin Link"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
