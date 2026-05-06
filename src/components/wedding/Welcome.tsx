import header from "@/assets/wedding/header-couple.jpg";
import { Reveal } from "./Reveal";

export function Welcome() {
  return (
    <section id="welcome" className="relative px-6 py-20 sm:py-28">
      <div className="mx-auto grid max-w-5xl items-center gap-12 md:grid-cols-2">
        <Reveal>
          <h2 className="font-script text-5xl text-foreground sm:text-6xl">Welcome</h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-foreground/80">
            You didn't receive this invitation by chance. You hold a special place in our hearts.
            Kami dengan senang hati menyambut Anda di pernikahan kami.
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="relative mx-auto w-full max-w-lg md:max-w-xl">
            <div className="aspect-[4/5] w-full overflow-hidden rounded-2xl shadow-xl ring-8 ring-white/50">
              <img
                src={header}
                alt="Arief dan Galuh"
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                loading="lazy"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
