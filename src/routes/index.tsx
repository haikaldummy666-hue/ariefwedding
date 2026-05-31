import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "sonner";
import { z } from "zod";
import { BarChart3, Scan, LogOut } from "lucide-react";

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
import { GuestGenerator } from "@/components/wedding/GuestGenerator";
import { Button } from "@/components/ui/button";

import { useSearch, useNavigate } from "@tanstack/react-router";

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
  const navigate = useNavigate();
  const isAdmin = search.admin === "secret";
  const [activeTab, setActiveTab] = useState<'generate' | 'invite'>('generate');

  // Auto-open envelope for admin
  useEffect(() => {
    if (isAdmin) {
      setOpened(true);
    }
  }, [isAdmin]);

  // Auto-scroll: Gerakan lambat dan kontinu
  useAutoScroll(opened, 0.4);

  const handleLogout = () => {
    navigate({ to: "/" });
  };

  return (
    <div id="top" className="relative min-h-screen bg-cream">
      <Loader />
      <Toaster position="top-center" richColors />

      {isAdmin ? (
        <div className="min-h-screen flex items-center justify-center px-6 py-20">
          <div className="w-full max-w-4xl">
            {/* Admin Header */}
            <div className="mb-10">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h1 className="text-center font-script text-5xl text-sage mb-2">
                    Admin Panel
                  </h1>
                  <p className="text-center text-sm tracking-widest text-foreground/50 uppercase">
                    Kelola Undangan & Kehadiran Tamu
                  </p>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="flex gap-2 justify-center mb-8 flex-wrap">
                <Button
                  onClick={() => setActiveTab('generate')}
                  className={`${
                    activeTab === 'generate'
                      ? 'bg-sage hover:bg-sage/90'
                      : 'bg-white hover:bg-gray-50 border border-gray-200 text-sage'
                  }`}
                >
                  Kelola Tamu
                </Button>
                <Button
                  onClick={() => setActiveTab('invite')}
                  className={`${
                    activeTab === 'invite'
                      ? 'bg-sage hover:bg-sage/90'
                      : 'bg-white hover:bg-gray-50 border border-gray-200 text-sage'
                  }`}
                >
                  Generate Link Undangan
                </Button>
                <Button
                  onClick={() => navigate({ to: '/check-in', search: { admin: 'secret' } })}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Scan className="w-4 h-4 mr-2" />
                  Scan Kehadiran
                </Button>
                <Button
                  onClick={() => navigate({ to: '/attendance-report', search: { admin: 'secret' } })}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Laporan Kehadiran
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="destructive"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Keluar
                </Button>
              </div>
            </div>

            {/* Content */}
            {activeTab === 'generate' ? (
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-sage/20">
                <GuestGenerator />
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-sage/20">
                <h3 className="font-script text-3xl text-sage mb-6">Generate Link Undangan</h3>
                <LinkGenerator />
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}
