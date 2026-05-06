import { Reveal } from "./Reveal";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
// June 2026: starts on Monday (day 1 = Mon). Sun=0 col empty.
const cells: (number | null)[] = [];
const firstDow = new Date(2026, 5, 1).getDay(); // 1
for (let i = 0; i < firstDow; i++) cells.push(null);
for (let d = 1; d <= 30; d++) cells.push(d);

function downloadIcs() {
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Arief Galuh Wedding//EN",
    "BEGIN:VEVENT",
    "UID:arief-galuh-2026@wedding",
    "DTSTAMP:20260101T000000Z",
    "DTSTART:20260606T010000Z",
    "DTEND:20260606T070000Z",
    "SUMMARY:The Wedding of Arief & Galuh",
    "LOCATION:Taman Sari Hotel & Resort",
    "DESCRIPTION:Akad 08.00–10.00 WIB · Resepsi 11.00–14.00 WIB",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const blob = new Blob([ics], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "arief-galuh-wedding.ics";
  a.click();
  URL.revokeObjectURL(url);
}

export function CalendarSection() {
  return (
    <section id="calendar" className="bg-cream/50 px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-md">
        <Reveal>
          <div className="rounded-lg bg-cream p-8 shadow-soft">
            <h3 className="text-center font-serif-display text-3xl">Juni / 2026</h3>
            <div className="mt-6 grid grid-cols-7 gap-1 text-center text-xs text-foreground/60">
              {days.map((d) => (
                <div key={d} className="py-1">
                  {d}
                </div>
              ))}
              {cells.map((d, i) => (
                <div
                  key={i}
                  className={`flex aspect-square items-center justify-center rounded-full text-sm ${
                    d === 6
                      ? "bg-foreground font-semibold text-cream"
                      : "text-foreground/80"
                  }`}
                >
                  {d ?? ""}
                </div>
              ))}
            </div>
            <p className="mt-5 text-center font-script text-2xl text-gold">
              It's Wedding Day!
            </p>
            <button
              onClick={downloadIcs}
              className="mt-6 w-full rounded-md bg-foreground py-3 text-xs tracking-[0.3em] text-cream transition-colors hover:bg-foreground/90"
            >
              ADD TO CALENDAR
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
