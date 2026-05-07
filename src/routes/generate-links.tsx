import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Copy, Check, Link as LinkIcon, MessageSquare, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Reveal } from "@/components/wedding/Reveal";

export const Route = createFileRoute("/generate-links")({
  component: GenerateLinksPage,
});

function GenerateLinksPage() {
  return (
    <div className="min-h-screen bg-cream px-6 py-20 flex flex-col items-center">
      <Reveal>
        <div className="text-center mb-10">
          <h1 className="font-script text-5xl text-sage mb-2">Link Generator</h1>
          <p className="text-sm tracking-widest text-foreground/50 uppercase">Admin Dashboard</p>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <LinkGenerator />
      </Reveal>

      <Reveal delay={0.2}>
        <a 
          href="/" 
          className="mt-12 inline-flex items-center gap-2 text-xs tracking-[0.3em] text-foreground/40 hover:text-sage transition-colors uppercase"
        >
          <ArrowLeft size={14} /> Kembali ke Undangan
        </a>
      </Reveal>
    </div>
  );
}

export function LinkGenerator() {
  const [guestName, setGuestName] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [generatedMessage, setGeneratedMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [messageCopied, setMessageCopied] = useState(false);

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

  const generateMessage = () => {
    if (!guestName.trim()) {
      toast.error("Masukkan nama tamu terlebih dahulu");
      return;
    }
    
    const baseUrl = window.location.origin;
    const encodedName = encodeURIComponent(guestName.trim());
    const link = `${baseUrl}?to=${encodedName}&v=1`;
    
    const message = `Kepada Yth.
${guestName}

Assalamualaikum warahmatullahi wabarakatuh

Dengan memohon rahmat dan ridha Allah SWT, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk hadir di hari bahagia kami.

Untuk mengetahui detail acara, silakan membuka tautan undangan berikut:
${link}

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir serta memberikan doa restu kepada kami.

Atas perhatian, kehadiran, dan doa yang diberikan, kami mengucapkan terima kasih.

Wassalamualaikum warahmatullahi wabarakatuh

Kami yang berbahagia,
Galuh & Arief`;

    setGeneratedMessage(message);
    setMessageCopied(false);
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

  const copyMessageToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedMessage);
      setMessageCopied(true);
      toast.success("Pesan berhasil disalin!");
      setTimeout(() => setMessageCopied(false), 2000);
    } catch (err) {
      toast.error("Gagal menyalin pesan");
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Input Section */}
      <div className="bg-white p-6 rounded-2xl shadow-xl border border-sage/20">
        <div className="flex items-center gap-2 mb-4">
          <LinkIcon className="text-sage w-5 h-5" />
          <h3 className="font-semibold text-lg text-sage">Generate Undangan</h3>
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

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={generate}
              className="bg-sage text-white py-2 rounded-lg font-medium hover:bg-sage/90 transition-colors shadow-md"
            >
              Generate Link
            </button>
            <button
              onClick={generateMessage}
              className="bg-gold/80 text-white py-2 rounded-lg font-medium hover:bg-gold transition-colors shadow-md flex items-center justify-center gap-2"
            >
              <MessageSquare size={16} />
              Generate Pesan
            </button>
          </div>
        </div>
      </div>

      {/* Link Result */}
      {generatedLink && (
        <div className="p-4 bg-cream rounded-xl border border-sage/20">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">Link Hasil Generate:</p>
          <p className="text-sm text-sage font-mono mb-3 break-all">{generatedLink}</p>
          <button
            onClick={copyToClipboard}
            className="flex items-center justify-center gap-2 w-full bg-white border border-sage text-sage py-1.5 rounded-md text-sm font-medium hover:bg-sage hover:text-white transition-all"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? "Tersalin!" : "Salin Link"}
          </button>
        </div>
      )}

      {/* Message Result */}
      {generatedMessage && (
        <div className="p-4 bg-cream rounded-xl border border-gold/20">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-3">Pesan Undangan:</p>
          <div className="bg-white p-4 rounded-lg border border-sage/10 mb-3 max-h-80 overflow-y-auto">
            <p className="text-sm text-foreground whitespace-pre-wrap font-sans leading-relaxed">{generatedMessage}</p>
          </div>
          <button
            onClick={copyMessageToClipboard}
            className="flex items-center justify-center gap-2 w-full bg-white border border-gold text-gold py-1.5 rounded-md text-sm font-medium hover:bg-gold hover:text-white transition-all"
          >
            {messageCopied ? <Check size={16} /> : <Copy size={16} />}
            {messageCopied ? "Pesan Tersalin!" : "Salin Pesan"}
          </button>
        </div>
      )}
    </div>
  );
}
