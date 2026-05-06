import { createFileRoute } from "@tanstack/react-router";
import { LinkGenerator } from "@/components/wedding/LinkGenerator";
import { Reveal } from "@/components/wedding/Reveal";
import { ArrowLeft } from "lucide-react";

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
