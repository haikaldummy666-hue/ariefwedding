import { useEffect, useState } from "react";
import { Reveal } from "./Reveal";

const TARGET = new Date("2026-06-06T08:00:00+07:00").getTime();

function diff() {
  const ms = Math.max(0, TARGET - Date.now());
  const d = Math.floor(ms / 86400000);
  const h = Math.floor((ms / 3600000) % 24);
  const m = Math.floor((ms / 60000) % 60);
  const s = Math.floor((ms / 1000) % 60);
  return { d, h, m, s };
}

function Cell({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center">
      <div className="font-serif-display text-5xl tabular-nums text-foreground sm:text-6xl">
        {String(value).padStart(2, "0")}
      </div>
      <div className="mt-1 text-[10px] tracking-[0.3em] uppercase text-foreground/60">{label}</div>
    </div>
  );
}

export function Countdown() {
  const [t, setT] = useState(diff);
  useEffect(() => {
    const i = setInterval(() => setT(diff()), 1000);
    return () => clearInterval(i);
  }, []);

  return (
    <section className="px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <h2 className="font-script text-5xl sm:text-6xl">Our Big Day Awaits</h2>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="mt-10 flex items-center justify-center gap-4 sm:gap-8">
            <Cell value={t.d} label="Days" />
            <span className="font-serif-display text-4xl text-foreground/40">:</span>
            <Cell value={t.h} label="Hours" />
            <span className="font-serif-display text-4xl text-foreground/40">:</span>
            <Cell value={t.m} label="Minutes" />
            <span className="font-serif-display text-4xl text-foreground/40">:</span>
            <Cell value={t.s} label="Seconds" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
