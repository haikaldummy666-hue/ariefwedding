import { Reveal } from "./Reveal";
import { motion } from "framer-motion";

import s1 from "@/assets/wedding/DSC08634.jpg";
import s2 from "@/assets/wedding/DSC08615.jpg";
import s3 from "@/assets/wedding/DSC08407.jpg";
import s4 from "@/assets/wedding/DSC08386.jpg";

const storyImages = [s1, s2, s3, s4];

export function OurStory() {
  return (
    <section id="story" className="relative bg-blush/40 px-6 py-20 sm:py-28 overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <div className="relative mx-auto w-full max-w-md">
            <div className="grid grid-cols-2 gap-2 p-3 bg-white shadow-2xl rounded-sm rotate-[-2deg] border border-gray-100">
              {storyImages.map((src, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05, zIndex: 10 }}
                  className="aspect-square overflow-hidden bg-cream"
                >
                  <img
                    src={src}
                    alt={`Story ${i + 1}`}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </motion.div>
              ))}
              <div className="col-span-2 text-center pt-6 pb-2">
                <span className="font-script text-3xl text-sage/80 tracking-wide">Our Story</span>
              </div>
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-4 -right-4 h-24 w-24 bg-sage/10 rounded-full blur-3xl -z-10" />
            <div className="absolute -top-4 -left-4 h-24 w-24 bg-gold/10 rounded-full blur-3xl -z-10" />
          </div>
        </Reveal>
        
        <Reveal delay={0.15}>
          <div className="lg:pl-8">
            <h2 className="font-script text-5xl text-sage sm:text-6xl">Our Story</h2>
            <div className="mt-6 space-y-6 text-base leading-relaxed text-foreground/80">
              <p>
                Kisah kami dimulai di Nusaputra University, meskipun kami sebelumnya tidak pernah
                bertemu karena kami berada di kelas yang berbeda tanpa pernah punya kesempatan untuk
                menyapa.
              </p>
              <p>
                Semuanya berubah ketika Arief akhirnya memberanikan diri mengirim pesan. Apa yang
                awalnya hanya percakapan sederhana perlahan berkembang menjadi hubungan yang lebih
                dalam, hingga kami mulai berpacaran. 
              </p>
              <p>
                Seiring waktu, ikatan kami berubah menjadi cinta
                yang tulus, membawa kami pada keputusan untuk melangkah bersama dalam pernikahan yang suci.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
