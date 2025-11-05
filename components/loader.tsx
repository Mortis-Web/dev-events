"use client";
import { motion } from "framer-motion";

const  Loader =()=> {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <motion.div
        className="relative flex h-16 w-16 items-center justify-center"
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 1.2,
          ease: "linear",
        }}
      >
        <div className="absolute h-12 w-12 rounded-full border-4 border-(--light-ray) border-t-transparent" />
      </motion.div>
    </div>
  );
}

export default Loader
