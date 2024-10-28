import { motion } from "framer-motion";

const HeartAnimation = () => {
  const hearts = Array(5).fill("❤️");
  
  return (
    <div className="pointer-events-none fixed inset-0 flex items-center justify-center">
      {hearts.map((_, index) => (
        <motion.div
          key={index}
          initial={{ 
            opacity: 1,
            scale: 0,
            y: 0,
            x: 0 
          }}
          animate={{ 
            opacity: 0,
            scale: 1,
            y: -100,
            x: Math.random() * 100 - 50 
          }}
          transition={{ 
            duration: 1,
            delay: index * 0.1,
            ease: "easeOut"
          }}
          className="absolute text-2xl"
        >
          ❤️
        </motion.div>
      ))}
    </div>
  );
};

export default HeartAnimation;