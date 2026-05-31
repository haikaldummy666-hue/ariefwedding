import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useSearch } from "@tanstack/react-router";
import { Navigate } from "@tanstack/react-router";
import { z } from "zod";
import { CheckInPanel } from "@/components/wedding/CheckInPanel";
import { Reveal } from "@/components/wedding/Reveal";

const checkInSearchSchema = z.object({
  admin: z.string().optional(),
});

export const Route = createFileRoute("/check-in")({
  component: CheckInPage,
  validateSearch: (search) => checkInSearchSchema.parse(search),
});

function CheckInPage() {
  const search = useSearch({ from: "/check-in" }) as { admin?: string };
  const isAdmin = search.admin === "secret";

  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-cream px-6 py-20">
      <Reveal>
        <div className="text-center mb-12">
          <h1 className="font-script text-5xl text-sage mb-2">Check-in Tamu</h1>
          <p className="text-sm tracking-widest text-foreground/50 uppercase">
            Sistem Verifikasi Kehadiran
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="max-w-7xl mx-auto">
          <CheckInPanel />
        </div>
      </Reveal>
    </div>
  );
}
