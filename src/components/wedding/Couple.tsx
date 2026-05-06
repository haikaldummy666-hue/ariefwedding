import center from "@/assets/wedding/couple-center.jpg";
import { Reveal } from "./Reveal";

function Card({
  side,
  script,
  fullName,
  parents,
}: {
  side: "left" | "right";
  script: string;
  fullName: string;
  parents: string[];
}) {
  return (
    <div className={`text-center ${side === "right" ? "md:text-left" : "md:text-right"}`}>
      <h3 className="font-script text-6xl text-foreground sm:text-7xl">{script}</h3>
      <p className="mt-3 text-base font-semibold tracking-wide text-foreground">{fullName}</p>
      <p className="mt-3 text-sm text-foreground/70">Putra/Putri dari</p>
      {parents.map((p) => (
        <p key={p} className="text-sm text-foreground/80">
          {p}
        </p>
      ))}
    </div>
  );
}

export function Couple() {
  return (
    <section className="px-6 py-20 sm:py-28">
      <div className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-3">
        <Reveal>
          <Card
            side="left"
            script="Arief"
            fullName="Rifki Arief Munandar"
            parents={["Bapak Asep Munandar", "& Ibu Yuti Martina"]}
          />
        </Reveal>
        <Reveal delay={0.1}>
          <div className="group relative mx-auto w-full max-w-xs overflow-hidden rounded-2xl shadow-xl ring-4 ring-white/50 transition-transform duration-500 hover:scale-[1.03]">
            <div className="aspect-[3/4] w-full overflow-hidden">
              <img src={center} alt="Arief & Galuh" loading="lazy" className="h-full w-full object-cover" />
            </div>
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        </Reveal>
        <Reveal delay={0.2}>
          <Card
            side="right"
            script="Galuh"
            fullName="Galuh Ratna Putri"
            parents={["Bapak Oman Sumantri", "& Ibu Rita Hermawati"]}
          />
        </Reveal>
      </div>
    </section>
  );
}
