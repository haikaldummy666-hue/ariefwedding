import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "sonner";
import { z } from "zod";

import { Loader } from "@/components/wedding/Loader";
import { EnvelopeCover } from "@/components/wedding/EnvelopeCover";
import { Nav } from "@/components/wedding/Nav";
import { Welcome } from "@/components/wedding/Welcome";
import { OurStory } from "@/components/wedding/OurStory";
import { Couple } from "@/components/wedding/Couple";
import { CalendarSection } from "@/components/wedding/Calendar";
import { Events } from "@/components/wedding/Events";
import { Dresscode } from "@/components/wedding/Dresscode";
import { RSVP } from "@/components/wedding/RSVP";
import { Gift } from "@/components/wedding/Gift";
import { Countdown } from "@/components/wedding/Countdown";
import { Gallery } from "@/components/wedding/Gallery";
import { Footer } from "@/components/wedding/Footer";
import { MusicPlayer } from "@/components/wedding/MusicPlayer";
import { PetalFall } from "@/components/wedding/PetalFall";
import { useAutoScroll } from "@/hooks/use-auto-scroll";

const guestSearchSchema = z.object({
  to: z.string().optional(),
  v: z.coerce.string().optional(),
});

export const Route = createFileRoute("/")({
  component: Index,
  validateSearch: (search) => guestSearchSchema.parse(search),
});

function Index() {
  const [opened, setOpened] = useState(false);

  // Auto-scroll: Gerakan lambat dan kontinu
  useAutoScroll(opened, 0.4);

  return (
    <div id="top" className="relative min-h-screen bg-cream">
      <Loader />
      <Toaster position="top-center" richColors />

      <AnimatePresence>
        {!opened && <EnvelopeCover key="cover" onOpen={() => setOpened(true)} />}
      </AnimatePresence>

      {opened && (
        <>
          <PetalFall />
          <MusicPlayer autoStart />
          <Nav />
          <main className="relative z-10">
            <Welcome />
            <OurStory />
            <Couple />
            <CalendarSection />
            <Events />
            <Dresscode />
            <RSVP />
            <Gift />
            <Countdown />
            <Gallery />
          </main>
          <Footer />
        </>
      )}
    </div>
  );
}
