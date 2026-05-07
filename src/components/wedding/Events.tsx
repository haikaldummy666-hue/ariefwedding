import { MapPin } from "lucide-react";
import akadImage from "@/assets/wedding/akad.jpeg";
import resepsiImage from "@/assets/wedding/p3-23.jpg";
import { Reveal } from "./Reveal";

const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Taman+Sari+Hotel+%26+Resort+Sukabumi";

function EventCard({
  title,
  time,
  image,
}: {
  title: string;
  time: string;
  image: string;
}) {
  return (
    <div className="rounded-lg bg-cream p-6 text-center shadow-soft">
      <h3 className="font-script text-5xl text-foreground">{title}</h3>
      <p className="mt-3 text-sm font-semibold tracking-wider text-foreground">
        Taman Sari Hotel &amp; Resort
      </p>
      <p className="mt-1 text-sm text-foreground/70">{time}</p>
      <div className="my-5 overflow-hidden rounded-md">
        <img src={image} alt={title} loading="lazy" className="w-full" />
      </div>
      <a
        href={MAPS_URL}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2 text-[11px] tracking-[0.3em] text-primary-foreground transition-opacity hover:opacity-90"
      >
        <MapPin size={14} /> VIEW LOCATION
      </a>
    </div>
  );
}

export function Events() {
  return (
    <section id="events" className="px-6 py-20 sm:py-28">
      <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
        <Reveal>
          <EventCard title="Akad" time="08.00 WIB — 10.00 WIB" image={akadImage} />
        </Reveal>
        <Reveal delay={0.15}>
          <EventCard title="Resepsi" time="11.00 WIB — 14.00 WIB" image={resepsiImage} />
        </Reveal>
      </div>
    </section>
  );
}
