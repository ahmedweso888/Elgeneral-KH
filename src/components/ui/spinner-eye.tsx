import type { CSSProperties } from "react";

const GOLD = "#D4AF37";
const LAPIS = "#2563EB";
const SAND = "#F3E5C8";

interface SpinnerEyeProps {
  size?: number;
}

export default function SpinnerEye({
  size = 64,
}: {
  size?: number;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <style>{`
        @keyframes iris-s {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes pupil-p {
          0%,100% {
            r: 3.5;
          }
          50% {
            r: 5;
          }
        }

        @keyframes kohl-f {
          0%,100% {
            opacity: .35;
          }
          50% {
            opacity: .8;
          }
        }
      `}</style>

      {/* Eyelid */}
      <path
        d="M4 20 Q20 7 36 20 Q20 33 4 20Z"
        stroke={GOLD}
        strokeOpacity=".25"
        strokeWidth="1.5"
      />

      {/* Ghost Iris */}
      <circle
        cx="20"
        cy="20"
        r="8.5"
        stroke={LAPIS}
        strokeOpacity=".2"
        strokeWidth="2"
      />

      {/* Rotating Iris */}
      <circle
        cx="20"
        cy="20"
        r="8.5"
        stroke="url(#eye-g)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeDasharray="18 35"
        style={{
          transformOrigin: "20px 20px",
          animation: "iris-s 1.8s linear infinite",
        }}
      />

      {/* Pupil */}
      <circle
        cx="20"
        cy="20"
        r="3.5"
        fill={LAPIS}
        fillOpacity=".6"
        style={
          {
            animationName: "pupil-p",
            animationDuration: "2s",
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
          } as CSSProperties
        }
      />

      {/* Highlight */}
      <circle cx="20" cy="20" r="1.8" fill={SAND} />

      {/* Left Kohl */}
      <line
        x1="4"
        y1="20"
        x2="10"
        y2="20"
        stroke={GOLD}
        strokeWidth="1.8"
        strokeLinecap="round"
        style={{
          animation: "kohl-f 2s ease-in-out infinite",
        }}
      />

      {/* Right Kohl */}
      <line
        x1="30"
        y1="20"
        x2="36"
        y2="20"
        stroke={GOLD}
        strokeWidth="1.8"
        strokeLinecap="round"
        style={{
          animation: "kohl-f 2s .4s ease-in-out infinite",
        }}
      />

      {/* Horus Drop */}
      <path
        d="M17.5 27.5 Q20 31 22.5 27.5"
        stroke={GOLD}
        strokeOpacity=".45"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      <defs>
        <linearGradient
          id="eye-g"
          gradientUnits="userSpaceOnUse"
          x1="20"
          y1="11.5"
          x2="28.5"
          y2="20"
        >
          <stop stopColor={SAND} />
          <stop offset="1" stopColor={LAPIS} stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}