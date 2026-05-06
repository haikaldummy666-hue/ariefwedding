import { Copy } from "lucide-react";
import { toast } from "sonner";
import { Reveal } from "./Reveal";

const ACCOUNT = {
  bank: "BCA",
  number: "038 272 0367",
  holder: "Galuh Ratna Putri",
};

export function Gift() {
  const copy = async () => {
    await navigator.clipboard.writeText(ACCOUNT.number.replace(/\s/g, ""));
    toast.success("Nomor rekening berhasil disalin!");
  };

  return (
    <section id="gift" className="bg-blush/30 px-6 py-20 sm:py-28">
      <div className="mx-auto grid max-w-4xl items-center gap-10 md:grid-cols-2">
        <Reveal>
          <div className="text-center md:text-left">
            <p className="text-sm leading-relaxed text-foreground/80">
              Kehadiran Anda adalah hadiah yang paling berarti bagi kami. Namun, jika Anda ingin
              memberikan sesuatu lebih, kami dengan hormat lebih mengutamakan hadiah dalam bentuk
              uang untuk membantu kami memulai babak baru bersama.
            </p>
            <p className="mt-4 font-script text-2xl text-gold">Terima Kasih!</p>
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="text-center">
            <h2 className="font-script text-6xl text-foreground">
              Wedding <span className="text-gold">Gift</span>
            </h2>
            <div className="mt-6 inline-flex items-center gap-3 rounded-full bg-primary/90 px-5 py-3 text-cream shadow-soft">
              <span className="rounded-md bg-cream px-2 py-1 text-[11px] font-semibold text-primary">
                {ACCOUNT.bank}
              </span>
              <div className="text-left">
                <p className="text-sm font-semibold tracking-wider">{ACCOUNT.number}</p>
                <p className="text-[10px] opacity-80">a.n {ACCOUNT.holder}</p>
              </div>
              <button
                type="button"
                onClick={copy}
                aria-label="Salin nomor rekening"
                className="ml-1 inline-flex items-center gap-1 rounded-full bg-cream/20 px-3 py-1 text-[11px] hover:bg-cream/30"
              >
                <Copy size={12} /> Copy
              </button>
            </div>
            {/* E-wallet placeholders */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-[11px] text-foreground/50">
              {["GoPay", "OVO", "Dana", "ShopeePay"].map((p) => (
                <span key={p} className="rounded-full border border-border px-3 py-1">
                  {p} · soon
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
