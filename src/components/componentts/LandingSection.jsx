// "use client";

// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import Link from "next/link";

// export default function LandingSection() {
//   const [isClient, setIsClient] = useState(false);

//   useEffect(() => {
//     setIsClient(true);
//   }, []);

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: { staggerChildren: 0.03 },
//     },
//   };

//   const letterVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
//   };

//   const buttonVariants = {
//     hover: { scale: 1.08, boxShadow: "0 8px 16px rgba(183, 28, 28, 0.3)" },
//     tap: { scale: 0.95 },
//   };

//   return (
//     <section className="relative w-full h-[100vh] overflow-hidden">
//       {/* Video Background */}
//       {isClient && (
//         <motion.video
//           autoPlay
//           muted
//           loop
//           playsInline
//           className="absolute top-0 left-0 w-full h-full object-cover z-0"
//           initial={{ scale: 1 }}
//           animate={{ scale: 1.05 }}
//           transition={{
//             duration: 10,
//             repeat: Infinity,
//             repeatType: "reverse",
//             ease: "easeInOut",
//           }}
//         >
//           <source src="/hero.mp4" type="video/mp4" />
//           Your browser does not support the video tag.
//         </motion.video>
//       )}

//       {/* Light Overlay */}
//       <div className="absolute top-0 left-0 w-full h-full bg-black/40 z-10" />

//       {/* Text Content */}
//       <motion.div
//         initial={{ opacity: 0, y: 40 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 1 }}
//         className="relative z-20 h-full flex flex-col items-center justify-center text-center px-4"
//       >
//         <motion.div
//           className="flex flex-col items-center gap-4"
//           variants={containerVariants}
//           initial="hidden"
//           animate="visible"
//         >
//           <motion.h1 className="text-2xl md:text-5xl font-semibold leading-snug text-neutral-100 drop-shadow-md">
//             {"A professional platform".split("").map((char, index) => (
//               <motion.span key={index} variants={letterVariants}>
//                 {char}
//               </motion.span>
//             ))}
//           </motion.h1>

//           <motion.h1 className="text-xl md:text-4xl font-medium leading-snug text-neutral-200 drop-shadow-md">
//             {"built by and for ITI graduates — connect, grow, and shine."
//               .split("")
//               .map((char, index) => (
//                 <motion.span key={index} variants={letterVariants}>
//                   {char}
//                 </motion.span>
//               ))}
//           </motion.h1>
//         </motion.div>

//         <motion.div
//           variants={buttonVariants}
//           whileHover="hover"
//           whileTap="tap"
//           className="mt-8"
//         >
//           <Link
//             href="/login"
//             className="bg-[#B71C1C] text-white px-6 py-3 rounded-md hover:bg-[#d32f2f] transition-colors duration-200 text-lg font-semibold drop-shadow-lg"
//           >
//             Get Started
//           </Link>
//         </motion.div>
//       </motion.div>
//     </section>
//   );
// }
/////////////////////////////////////////////
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function LandingSection() {
  const [isClient, setIsClient] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.03 },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const buttonVariants = {
    hover: { scale: 1.08, boxShadow: "0 8px 16px rgba(183, 28, 28, 0.3)" },
    tap: { scale: 0.95 },
  };

  return (
    <section className="relative w-full h-[100vh] overflow-hidden">
      {/* Video Background */}
      {isClient && (
        <motion.video
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
          initial={{ scale: 1 }}
          animate={{ scale: 1.05 }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        >
          <source src="/hero.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </motion.video>
      )}

      {/* Light Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/40 z-10" />

      {/* Text Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-20 h-full flex flex-col items-center justify-center text-center px-4"
      >
        <motion.div
          className="flex flex-col items-center gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 className="text-2xl md:text-5xl font-semibold leading-snug text-neutral-100 drop-shadow-md">
            {"A professional platform".split("").map((char, index) => (
              <motion.span key={index} variants={letterVariants}>
                {char}
              </motion.span>
            ))}
          </motion.h1>

          <motion.h1 className="text-xl md:text-4xl font-medium leading-snug text-neutral-200 drop-shadow-md">
            {"built by and for ITI graduates — connect, grow, and shine."
              .split("")
              .map((char, index) => (
                <motion.span key={index} variants={letterVariants}>
                  {char}
                </motion.span>
              ))}
          </motion.h1>
        </motion.div>

        {status === "unauthenticated" && (
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            className="mt-8"
          >
            <Link
              href="/login"
              className="bg-[#B71C1C] text-white px-6 py-3 rounded-md hover:bg-[#d32f2f] transition-colors duration-200 text-lg font-semibold drop-shadow-lg"
            >
              Get Started
            </Link>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
