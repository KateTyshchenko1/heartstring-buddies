import { motion } from "framer-motion";

const HeartAnimation = () => {
  return (
    <div className="pointer-events-none fixed inset-0 flex items-center justify-center" style={{ top: '50%' }}>
      <motion.div
        initial={{ 
          opacity: 1,
          scale: 0,
          y: 0
        }}
        animate={{ 
          opacity: 0,
          scale: 1,
          y: -50
        }}
        transition={{ 
          duration: 1,
          ease: "easeOut"
        }}
        className="absolute text-3xl"
      >
        ❤️
      </motion.div>
    </div>
  );
};

export default HeartAnimation;