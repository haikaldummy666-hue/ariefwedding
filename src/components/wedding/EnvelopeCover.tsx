import { motion } from "framer-motion";
import { useSearch } from "@tanstack/react-router";
import envelope from "@/assets/wedding/cover-envelope.jpg";

export function EnvelopeCover({ onOpen }: { onOpen: () => void }) {
  const search = useSearch({ from: "/" }) as { to?: string };
  const guestName = search.to;

  return (
    <motion.section
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8 }}
      className="floral-bg fixed inset-0 z-50 flex flex-col items-center justify-center px-6 text-center"
    >
      <p className="mb-3 text-xs tracking-[0.45em] text-foreground/70 sm:text-sm">A LOVE LETTER</p>
      <h1 className="font-script text-6xl leading-none text-foreground sm:text-7xl md:text-8xl">
        Arief <span className="text-gold">&amp;</span> Galuh
      </h1>

      {guestName && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <p className="text-[10px] tracking-[0.3em] text-foreground/50 uppercase">Dear</p>
          <h2 className="mt-2 text-xl font-medium text-foreground tracking-wide sm:text-2xl">
            {guestName}
          </h2>
        </motion.div>
      )}

      <motion.button
        type="button"
        onClick={onOpen}
        aria-label="Buka undangan"
        className="group mt-10 outline-none"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        whileTap={{ scale: 0.95 }}
      >
        <img
          src={envelope}
          alt="Amplop undangan dengan wax seal GA"
          className="w-[280px] drop-shadow-[0_20px_40px_rgba(80,60,30,0.18)] transition-transform duration-500 group-hover:scale-[1.03] sm:w-[360px] md:w-[420px]"
          loading="eager"
        />
      </motion.button>

      <p className="mt-8 text-[11px] tracking-[0.4em] text-foreground/80 sm:text-xs">
        KETUK AMPLOP UNTUK MEMBUKA UNDANGAN
      </p>

      <span className="absolute bottom-4 text-[10px] tracking-[0.3em] text-foreground/40">
        ARIEF &amp; GALUH · 06.06.2026
      </span>
    </motion.section>
  );
}
