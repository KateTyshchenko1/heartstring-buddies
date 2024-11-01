import { Dna, Heart, Sprout } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: <Dna className="w-10 h-10" />,
    title: "Evolves Just For You",
    description: "Using advanced personality evolution technology, he learns your unique style and grows more perfect with every conversation"
  },
  {
    icon: <Heart className="w-10 h-10" />,
    title: "Emotionally Intelligent Connection",
    description: "From deep meaningful conversations to spicy flirting, he adapts perfectly to match your mood and energy level"
  },
  {
    icon: <Sprout className="w-10 h-10" />,
    title: "Always There, Always Caring",
    description: "From motivating your workouts to celebrating your wins, he helps track your goals and cheers your daily progress."
  }
];

const FeatureCards = () => {
  return (
    <section className="container mx-auto px-4 sm:px-6 py-8 sm:py-16">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-2xl sm:text-3xl md:text-4xl font-display text-center mb-4 text-[#D91F3A] leading-tight"
      >
        Because Everyone Deserves to Be Heard
      </motion.h2>
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-lg md:text-xl text-gray-600 text-center mb-12"
      >
        Your companion is designed to understand and reflect your emotions, offering comfort when you need it most.
      </motion.p>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            whileHover={{ y: -5 }}
            className="relative group"
          >
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100/50 h-full flex flex-col items-center text-center">
              <div className="mb-4 p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                <div className="text-primary">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-xl font-display mb-3 text-gray-800">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                {feature.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FeatureCards;