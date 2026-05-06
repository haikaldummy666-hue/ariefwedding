import { useState } from "react";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { Reveal } from "./Reveal";
import { motion, AnimatePresence } from "framer-motion";

import g1 from "@/assets/wedding/DSC08339.jpg";
import g2 from "@/assets/wedding/DSC08347.jpg";
import g3 from "@/assets/wedding/DSC08386.jpg";
import g4 from "@/assets/wedding/DSC08407.jpg";
import g5 from "@/assets/wedding/DSC08615.jpg";
import g6 from "@/assets/wedding/DSC08634.jpg";
import g7 from "@/assets/wedding/DSC08696.jpg";
import g8 from "@/assets/wedding/DSC08858.jpg";
import g9 from "@/assets/wedding/DSC08899.jpg";
import g10 from "@/assets/wedding/DSC08977.jpg";

const photos = [g1, g2, g3, g4, g5, g6, g7, g8, g9, g10];

export function Gallery() {
  const [idx, setIdx] = useState<number | null>(null);

  const close = () => setIdx(null);
  const next = () => setIdx((i) => (i === null ? null : (i + 1) % photos.length));
  const prev = () =>
    setIdx((i) => (i === null ? null : (i - 1 + photos.length) % photos.length));

  return (
    <section id="gallery" className="bg-cream px-6 py-20 sm:py-28 overflow-hidden">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="text-center mb-12">
            <h2 className="font-script text-5xl sm:text-6xl text-sage">Our Moment</h2>
            <div className="mt-2 h-1 w-20 bg-gold/30 mx-auto rounded-full" />
          </div>
        </Reveal>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {photos.map((src, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <motion.button
                type="button"
                onClick={() => setIdx(i)}
                className="group relative aspect-square w-full overflow-hidden rounded-xl shadow-soft bg-white"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={src}
                  alt={`Moment ${i + 1}`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center">
                  <div className="bg-white/80 p-2 rounded-full transform translate-y-4 transition-transform duration-300 group-hover:translate-y-0">
                    <ZoomIn className="text-sage w-5 h-5" />
                  </div>
                </div>
              </motion.button>
            </Reveal>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {idx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4"
            onClick={close}
          >
            <motion.button
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                close();
              }}
              className="absolute right-6 top-6 text-white/70 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X size={32} />
            </motion.button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              className="absolute left-4 text-white/50 hover:text-white transition-colors z-10"
              aria-label="Previous"
            >
              <ChevronLeft size={48} />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative max-h-[85vh] max-w-[92vw]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={photos[idx]}
                alt=""
                className="max-h-[85vh] max-w-[92vw] rounded-lg shadow-2xl object-contain border-2 border-white/10"
              />
              <div className="absolute -bottom-10 left-0 right-0 text-center text-white/60 text-sm font-medium">
                {idx + 1} / {photos.length}
              </div>
            </motion.div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              className="absolute right-4 text-white/50 hover:text-white transition-colors z-10"
              aria-label="Next"
            >
              <ChevronRight size={48} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
