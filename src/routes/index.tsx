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
import { LinkGenerator } from "@/components/wedding/LinkGenerator";

import { useSearch } from "@tanstack/react-router";

const guestSearchSchema = z.object({
  to: z.string().optional(),
  v: z.coerce.string().optional(),
  admin: z.string().optional(),
});

export const Route = createFileRoute("/")({
  component: Index,
  validateSearch: (search) => guestSearchSchema.parse(search),
});

function Index() {
  const [opened, setOpened] = useState(false);
  const search = useSearch({ from: "/" }) as { admin?: string };
  const isAdmin = search.admin === "secret";

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
            {isAdmin && (
              <div className="mx-auto max-w-4xl px-6 py-10 bg-white shadow-lg rounded-2xl my-10">
                <h2 className="text-2xl font-script text-sage mb-6 text-center">Link Generator (Admin Only)</h2>
                <LinkGenerator />
              </div>
            )}
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
