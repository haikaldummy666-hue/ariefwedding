import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Loader() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let p = 0;
    const i = setInterval(() => {
      p += Math.random() * 12 + 6;
      if (p >= 100) {
        p = 100;
        clearInterval(i);
        setTimeout(() => setDone(true), 350);
      }
      setProgress(p);
    }, 120);
    return () => clearInterval(i);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="floral-bg fixed inset-0 z-[60] flex flex-col items-center justify-center px-6"
        >
          <p className="font-script text-5xl text-foreground">Arief &amp; Galuh</p>
          <div className="mt-8 h-[2px] w-56 overflow-hidden rounded-full bg-foreground/10">
            <div
              className="h-full bg-foreground transition-[width] duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-3 text-[10px] tracking-[0.4em] text-foreground/60">
            LOADING {Math.round(progress)}%
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
