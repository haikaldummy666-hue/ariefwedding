import { Reveal } from "./Reveal";

const palette = [
  { name: "Sage", color: "#A8B5A2" },
  { name: "Light Blue", color: "#B9C7DA" },
  { name: "Lavender", color: "#C7BCD6" },
  { name: "Pink", color: "#F2C9D4" },
  { name: "Beige", color: "#D8C5A8" },
];

export function Dresscode() {
  return (
    <section className="bg-cream px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-4xl text-center">
        <Reveal>
          <h2 className="font-script text-5xl sm:text-6xl">Dresscode</h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-foreground/70">
            Untuk menjaga keserasian momen kami, mohon kenakan busana dengan warna sesuai palette di
            bawah ini.
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-5">
            {palette.map((c) => (
              <div key={c.name} className="flex flex-col items-center gap-2">
                <span
                  className="block h-16 w-16 rounded-full shadow-soft ring-1 ring-border sm:h-20 sm:w-20"
                  style={{ backgroundColor: c.color }}
                />
                <span className="text-xs tracking-widest uppercase text-foreground/70">
                  {c.name}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-8 font-script text-3xl text-gold">Palette</p>
        </Reveal>
      </div>
    </section>
  );
}
