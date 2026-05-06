import { useEffect, useRef, useState } from "react";

export function useAutoScroll(enabled: boolean, speed: number = 0.4) {
  const [isPaused, setIsPaused] = useState(false);
  const requestRef = useRef<number | null>(null);
  const lastInteractionRef = useRef(Date.now());
  const scrollPosRef = useRef(window.scrollY);

  const animate = () => {
    if (!isPaused && enabled) {
      // Slow continuous scroll
      window.scrollBy(0, speed);
      scrollPosRef.current = window.scrollY;

      // Stop if reached bottom
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 2) {
        setIsPaused(true);
      }
    }
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const handleUserInteraction = () => {
      // Pause auto-scroll for 10 seconds after any manual interaction
      setIsPaused(true);
      lastInteractionRef.current = Date.now();
      
      const resumeTimeout = setTimeout(() => {
        // Only resume if enough time has passed since the last interaction
        if (Date.now() - lastInteractionRef.current >= 9500) {
          setIsPaused(false);
        }
      }, 10000);

      return () => clearTimeout(resumeTimeout);
    };

    window.addEventListener("wheel", handleUserInteraction, { passive: true });
    window.addEventListener("touchstart", handleUserInteraction, { passive: true });
    window.addEventListener("mousedown", handleUserInteraction, { passive: true });
    window.addEventListener("keydown", handleUserInteraction, { passive: true });

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("wheel", handleUserInteraction);
      window.removeEventListener("touchstart", handleUserInteraction);
      window.removeEventListener("mousedown", handleUserInteraction);
      window.removeEventListener("keydown", handleUserInteraction);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [enabled, isPaused, speed]);

  return { isPaused, setIsPaused };
}
