import { motion } from "framer-motion";

export default function GeneralWriting() {
  return (
    <svg
      className="general-writing"
      viewBox="0 0 900 250"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >

      <motion.path
        d="M80 150
        C120 80 170 80 210 150
        C240 200 300 190 340 130
        C380 70 450 70 500 140
        C540 190 600 180 650 120
        C700 60 760 90 820 150"
        stroke="white"
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{
          pathLength:0,
          opacity:0
        }}
        animate={{
          pathLength:1,
          opacity:1
        }}
        transition={{
          duration:3.2,
          ease:"easeInOut"
        }}
      />

      <motion.circle
        r="10"
        fill="white"
        initial={{
          opacity:0,
          offsetDistance:"0%"
        }}
        animate={{
          opacity:[0,1,0],
          offsetDistance:"100%"
        }}
        transition={{
          duration:3.2,
          ease:"easeInOut"
        }}
        style={{
          offsetPath:
          "path('M80 150 C120 80 170 80 210 150 C240 200 300 190 340 130 C380 70 450 70 500 140 C540 190 600 180 650 120 C700 60 760 90 820 150')"
        }}
      />

    </svg>
  );
}