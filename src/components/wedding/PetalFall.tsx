import { useMemo } from "react";

export function PetalFall({ count = 18 }: { count?: number }) {
  const petals = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 12,
        duration: 12 + Math.random() * 10,
        size: 8 + Math.random() * 10,
        hue: ["#E8D5C4", "#F2DDD1", "#D9E3D2", "#FBEFE5"][i % 4],
        rotate: Math.random() * 360,
      })),
    [count]
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      {petals.map((p) => (
        <span
          key={p.id}
          className="absolute top-0 block rounded-full opacity-70"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 0.6,
            background: `radial-gradient(circle at 30% 30%, ${p.hue}, transparent 70%)`,
            transform: `rotate(${p.rotate}deg)`,
            animation: `petal-fall ${p.duration}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
