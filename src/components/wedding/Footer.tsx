import { Share2 } from "lucide-react";
import { toast } from "sonner";
import { Reveal } from "./Reveal";

export function Footer() {
  const share = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const text = "The Wedding of Arief & Galuh — 6 Juni 2026";
    if (navigator.share) {
      try {
        await navigator.share({ title: text, url });
      } catch {
        /* user cancelled */
      }
      return;
    }
    await navigator.clipboard.writeText(url);
    toast.success("Link undangan tersalin!");
  };

  const wa = () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const text = encodeURIComponent(
      `Dengan hormat, kami mengundang Anda di pernikahan kami.\nArief & Galuh — 6 Juni 2026\n${url}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  return (
    <footer className="bg-blush/40 px-6 py-20 text-center sm:py-24">
      <Reveal>
        <h2 className="font-script text-7xl text-foreground sm:text-8xl">
          Arief <span className="text-gold">&amp;</span> Galuh
        </h2>
        <p className="mt-4 text-xs tracking-[0.5em] uppercase text-foreground/70">
          See you on June 6<sup>th</sup>
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={wa}
            className="rounded-full bg-primary px-5 py-2 text-xs tracking-widest text-primary-foreground hover:opacity-90"
          >
            Share via WhatsApp
          </button>
          <button
            onClick={share}
            className="inline-flex items-center gap-2 rounded-full border border-foreground/30 px-5 py-2 text-xs tracking-widest hover:bg-foreground/5"
          >
            <Share2 size={14} /> Share / Copy Link
          </button>
        </div>
        <a
          href="#calendar"
          className="mt-10 block text-[11px] tracking-[0.4em] uppercase text-foreground/60 underline"
        >
          Klik disini untuk detail lebih lanjut
        </a>
        <p className="mt-10 text-[10px] tracking-widest text-foreground/40">
          Made with love · 06.06.2026
        </p>
      </Reveal>
    </footer>
  );
}
