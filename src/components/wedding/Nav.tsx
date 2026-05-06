import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "#welcome", label: "Home" },
  { href: "#story", label: "Our Story" },
  { href: "#calendar", label: "Details" },
  { href: "#rsvp", label: "RSVP" },
  { href: "#gift", label: "Gift" },
  { href: "#gallery", label: "Gallery" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all ${
        scrolled ? "bg-cream/85 backdrop-blur-md shadow-soft" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <a href="#top" className="font-script text-2xl text-foreground">
          Arief <span className="text-gold">&amp;</span> Galuh
        </a>
        <nav className="hidden gap-7 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-xs tracking-[0.25em] uppercase text-foreground/70 transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <button
          type="button"
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <nav className="flex flex-col gap-3 border-t border-border bg-cream/95 px-6 py-5 md:hidden">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-sm tracking-[0.2em] uppercase text-foreground/80"
            >
              {l.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
