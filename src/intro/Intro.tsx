import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Intro({ onFinish }: { onFinish: () => void }) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDone(true);

      setTimeout(() => {
        onFinish();
      }, 900);

    }, 4200);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.04,
            filter: "blur(25px)",
          }}
          transition={{ duration: 1 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 999999,
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background:
              "linear-gradient(135deg,#cbb58b,#58648b,#243b8f)",
          }}
        >

          {/* الخلفية */}

          <motion.div
            animate={{
              x: [0, 80, 0],
              y: [0, -60, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              position: "absolute",
              width: 800,
              height: 800,
              borderRadius: "50%",
              background: "#d4ab50",
              filter: "blur(170px)",
              left: -300,
              top: -220,
              opacity: .85,
            }}
          />

          <motion.div
            animate={{
              x: [0, -70, 0],
              y: [0, 45, 0],
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 14,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              position: "absolute",
              width: 950,
              height: 950,
              borderRadius: "50%",
              background: "#0b174c",
              filter: "blur(190px)",
              right: -320,
              bottom: -280,
              opacity: .75,
            }}
          />

          <motion.div
            animate={{
              opacity: [.2, .45, .2],
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              position: "absolute",
              width: 650,
              height: 650,
              borderRadius: "50%",
              background: "#F7EFE2",
              filter: "blur(150px)",
              left: "50%",
              top: "50%",
              transform: "translate(-50%,-50%)",
            }}
          />

          {/* الكلمة */}

          <svg
            width="80%"
            viewBox="0 0 900 300"
            style={{
              position: "relative",
              zIndex: 10,
              overflow: "visible",
            }}
          >

            {/* الكتابة */}

            <motion.text
              x="450"
              y="170"
              textAnchor="middle"
              direction="rtl"
              fontFamily="Cairo"
              fontWeight="900"
              fontSize="150"

              fill="transparent"

              stroke="#FAF8F4"
              strokeWidth="3"

              strokeLinecap="round"
              strokeLinejoin="round"

              initial={{
                strokeDasharray: 900,
                strokeDashoffset: 900,
              }}

              animate={{
                strokeDashoffset: 0,
              }}

              transition={{
                duration: 3.2,
                ease: "easeInOut",
              }}
            >
              الجنرال
            </motion.text>
                        <motion.text
              x="450"
              y="170"
              textAnchor="middle"
              direction="rtl"
              fontFamily="Cairo"
              fontWeight="900"
              fontSize="150"
              fill="#FAF8F4"

              initial={{
                opacity: 0,
              }}

              animate={{
                opacity: 1,
                filter: [
                  "drop-shadow(0 0 0px rgba(255,255,255,0))",
                  "drop-shadow(0 0 18px rgba(255,255,255,.95)) drop-shadow(0 0 55px rgba(217,192,139,.95))",
                  "drop-shadow(0 0 6px rgba(255,255,255,.2))",
                ],
              }}

              transition={{
                delay: 3,
                duration: 0.9,
                times: [0, 0.45, 1],
              }}
            >
              الجنرال
            </motion.text>

          </svg>

        </motion.div>
      )}
    </AnimatePresence>
  );
}