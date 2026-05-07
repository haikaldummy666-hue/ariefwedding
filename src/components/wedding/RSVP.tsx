import { useEffect, useState } from "react";
import { z } from "zod";
import { Reveal } from "./Reveal";
import { toast } from "sonner";
import { Check, X } from "lucide-react";

type Entry = {
  id: string;
  name: string;
  message: string;
  attending: boolean;
  created_at: string;
};

const schema = z.object({
  name: z.string().trim().min(1, "Nama wajib diisi").max(100),
  message: z.string().trim().min(1, "Pesan wajib diisi").max(1000),
  attending: z.boolean(),
});

const STORAGE_KEY = "wedding_guestbook";

export function RSVP() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [attending, setAttending] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    // Load entries from localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setEntries(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse stored entries:", e);
      }
    }
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ name, message, attending });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setSubmitting(true);
    
    // Simulate a slight delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newEntry: Entry = {
      id: Date.now().toString(),
      name: parsed.data.name,
      message: parsed.data.message,
      attending: parsed.data.attending,
      created_at: new Date().toISOString(),
    };

    // Add to entries and save to localStorage
    const updated = [newEntry, ...entries];
    setEntries(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    setSubmitting(false);
    toast.success("Terima kasih atas doa & ucapannya!");
    setName("");
    setMessage("");
  };

  return (
    <section id="rsvp" className="bg-blush/40 px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-2xl">
        <Reveal>
          <div className="text-center">
            <h2 className="font-serif-display text-3xl">Reservasi</h2>
            <p className="font-script text-3xl text-gold">Buku Tamu</p>
            <p className="mt-2 text-sm text-foreground/70">
              Silakan tinggalkan pesan Anda di bawah ini.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <form
            onSubmit={onSubmit}
            className="mt-8 space-y-4 rounded-lg bg-cream p-6 shadow-soft"
          >
            <div>
              <label className="text-xs uppercase tracking-widest text-foreground/70">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={100}
                placeholder="Enter your name"
                className="mt-1 w-full rounded-md border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-foreground/70">
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={1000}
                rows={4}
                placeholder="Write your message here..."
                className="mt-1 w-full rounded-md border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-foreground/70">
                Attendance
              </label>
              <div className="mt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setAttending(true)}
                  className={`flex-1 rounded-md border px-4 py-2 text-sm transition-colors ${
                    attending
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background"
                  }`}
                >
                  Attending
                </button>
                <button
                  type="button"
                  onClick={() => setAttending(false)}
                  className={`flex-1 rounded-md border px-4 py-2 text-sm transition-colors ${
                    !attending
                      ? "border-foreground bg-foreground text-cream"
                      : "border-border bg-background"
                  }`}
                >
                  Not Attending
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-md bg-foreground py-3 text-xs tracking-[0.3em] text-cream transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {submitting ? "MENGIRIM..." : "SUBMIT MESSAGE"}
            </button>
          </form>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-10">
            <h3 className="text-sm font-semibold tracking-wider uppercase text-foreground/80">
              Guest Messages
            </h3>
            <div className="mt-4 space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {entries.length === 0 && (
                <p className="text-sm text-foreground/60">
                  Belum ada pesan. Jadilah yang pertama!
                </p>
              )}
              {entries.map((e) => (
                <div
                  key={e.id}
                  className="rounded-md border border-border bg-cream p-4 shadow-sm animate-in fade-in slide-in-from-top-2"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-foreground">{e.name}</p>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] ${
                        e.attending ? "bg-primary/15 text-primary" : "bg-foreground/10 text-foreground/70"
                      }`}
                    >
                      {e.attending ? <Check size={11} /> : <X size={11} />}
                      {e.attending ? "Attending" : "Not Attending"}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-foreground/50">
                    {new Date(e.created_at).toLocaleString("en-GB", {
                      dateStyle: "long",
                      timeStyle: "short",
                    })}
                  </p>
                  <p className="mt-2 text-sm text-foreground/80">{e.message}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
