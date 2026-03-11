import React, { useRef, useEffect } from "react";
import { cn } from "../../lib/utils";

export const NoiseBackground = ({
  children,
  className,
  containerClassName,
  gradientColors = ["rgb(255, 100, 150)", "rgb(100, 150, 255)", "rgb(255, 200, 100)"],
  noiseOpacity = 0.05,
}) => {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-black/5 p-1",
        containerClassName
      )}
    >
      <div
        className="absolute inset-0 z-0 scale-125 opacity-30"
        style={{
          background: `radial-gradient(circle at center, ${gradientColors.join(
            ", "
          )})`,
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute inset-0 z-[1] opacity-20 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      <div className={cn("relative z-10", className)}>{children}</div>
    </div>
  );
};
