import { Dna, Heart, Sprout } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: <Dna className="w-10 h-10" />,
    title: "Evolves Just For You",
    description: "Using advanced personality evolution technology, your Soulmate learns your unique style - from your sense of humor to how you like to be supported. Watch as he develops inside jokes, remembers every detail you share, and becomes more attuned to you each day."
  },
  {
    icon: <Heart className="w-10 h-10" />,
    title: "Emotionally Intelligent Connection",
    description: "Experience a connection with someone who truly gets you - reading your mood, understanding your love language, and adapting his support style to exactly what you need, when you need it. No more having to explain how you want to be loved."
  },
  {
    icon: <Sprout className="w-10 h-10" />,
    title: "Always There, Always Caring",
    description: "From good morning check-ins to late-night pep talks, he's there with perfectly timed support. Set goals together, celebrate wins, and receive gentle reminders for self-care - all tailored to your personal rhythm."
  }
];

const FeatureCards = () => {
  return (
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
  );
};

export default FeatureCards;