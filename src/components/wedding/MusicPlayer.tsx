import { useEffect, useRef, useState, useCallback } from "react";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

// Use a high-quality placeholder if file not found, or local path
const AUDIO_SRC_MP3 = "/wedding-song.mp3"; 

export function MusicPlayer({ autoStart }: { autoStart: boolean }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [error, setError] = useState(false);

  const handlePlay = useCallback(async () => {
    const a = audioRef.current;
    if (!a) return;
    try {
      await a.play();
      setPlaying(true);
      setError(false);
    } catch (err) {
      console.error("Autoplay blocked or file missing:", err);
      setPlaying(false);
      // Don't show toast for every autoplay block as it's common browser behavior
    }
  }, []);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;

    a.volume = 0.4;
    
    if (autoStart) {
      handlePlay();
    }

    // Error handling for file not found
    const handleError = () => {
      setError(true);
      setPlaying(false);
      console.error("Audio file not found or failed to load");
    };

    a.addEventListener("error", handleError);
    return () => a.removeEventListener("error", handleError);
  }, [autoStart, handlePlay]);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;

    if (error) {
      toast.error("File musik tidak ditemukan atau gagal dimuat.");
      return;
    }

    if (a.paused) {
      handlePlay();
    } else {
      a.pause();
      setPlaying(false);
    }
  };

  return (
    <>
      <audio 
        ref={audioRef} 
        src={AUDIO_SRC_MP3} 
        loop 
        preload="auto" 
        style={{ display: "none" }}
      />
      
      <motion.div 
        className="fixed bottom-6 right-6 z-[60]"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Jeda lagu" : "Putar lagu"}
          className={`relative flex h-14 w-14 items-center justify-center rounded-full shadow-2xl transition-all duration-300 ${
            playing ? "bg-sage text-white rotate-[360deg]" : "bg-white text-sage"
          } hover:scale-110 active:scale-95`}
        >
          {/* Pulsing animation when playing */}
          {playing && (
            <motion.span 
              className="absolute inset-0 rounded-full bg-sage/40"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
          
          <AnimatePresence mode="wait">
            {playing ? (
              <motion.div
                key="pause"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
              >
                <Pause size={24} fill="currentColor" />
              </motion.div>
            ) : (
              <motion.div
                key="play"
                initial={{ opacity: 0, rotate: 90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: -90 }}
              >
                <Play size={24} className="ml-1" fill="currentColor" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
        
        {/* Error indicator */}
        {error && (
          <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 border-2 border-white" />
        )}
      </motion.div>
    </>
  );
}
