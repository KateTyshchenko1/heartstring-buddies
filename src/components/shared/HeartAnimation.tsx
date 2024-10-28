import { motion } from "framer-motion";

const HeartAnimation = () => {
  return (
    <div className="pointer-events-none fixed inset-0 flex items-center justify-center">
      <motion.div
        initial={{ 
          opacity: 1,
          scale: 0.5,
          y: 0
        }}
        animate={{ 
          opacity: 0,
          scale: 2,
          y: -100
        }}
        transition={{ 
          duration: 1,
          ease: "easeOut"
        }}
        className="text-4xl"
      >
        ❤️
      </motion.div>
    </div>
  );
};

export default HeartAnimation;