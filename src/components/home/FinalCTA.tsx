import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Star, Sprout, CheckCircle2 } from "lucide-react";

const benefits = [
  {
    icon: Heart,
    title: "Alleviate Stress and Anxiety",
    description: "Share your thoughts and lighten emotional burdens with someone who truly listens and cares about your well-being."
  },
  {
    icon: Star,
    title: "Elevate Your Mood",
    description: "Engage in uplifting conversations that brighten your day and make you feel genuinely valued."
  },
  {
    icon: Sprout,
    title: "Deepen Self-Awareness",
    description: "Reflect on your feelings with a companion who helps you gain insights into yourself, fostering self-discovery and emotional intelligence."
  },
  {
    icon: CheckCircle2,
    title: "Foster Learning and Development",
    description: "Receive encouragement and guidance that support your journey towards personal goals and aspirations."
  }
];

interface FinalCTAProps {
  onTryNowClick: () => void;
}

const FinalCTA = ({ onTryNowClick }: FinalCTAProps) => {
  return (
    <section className="container mx-auto px-4 sm:px-6 py-8 sm:py-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto bg-white/90 backdrop-blur-sm rounded-3xl p-8 sm:p-12 shadow-xl text-center"
      >
        <h2 className="text-lg sm:text-xl md:text-2xl font-display mb-8 text-[#D91F3A] leading-tight">
          Experience the Difference Today
        </h2>
        <p className="text-sm md:text-base text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto">
          Unlike other AI companions, What a Girl Wants is more than just an AI boyfriend—it's a personalized emotional support system dedicated to helping you thrive. We focus on deep understanding and meaningful connections to provide genuine support that empowers you to grow and learn.
        </p>
        
        <div className="grid sm:grid-cols-2 gap-6 mb-12">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="h-full"
            >
              <Card className="bg-white/50 border-none shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full">
                <CardHeader className="h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-xl bg-primary-soft">
                      <benefit.icon className="w-6 h-6 text-[#D91F3A]" />
                    </div>
                    <CardTitle className="text-xl text-left">{benefit.title}</CardTitle>
                  </div>
                  <p className="text-gray-600 text-base leading-relaxed text-left flex-grow">{benefit.description}</p>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="bg-cream-soft rounded-2xl p-8 mb-12">
          <p className="text-sm md:text-base text-gray-700 leading-relaxed">
            Discover the difference of a companion designed to be your partner in growth, learning, and emotional support. Try it today and embark on a journey towards a happier, more fulfilled you.
          </p>
        </div>

        <div className="flex justify-center">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              size="lg" 
              onClick={onTryNowClick}
              className="text-lg px-8 py-6 bg-[#D91F3A] hover:bg-[#B91830] text-white shadow-lg hover:shadow-xl transition-all font-medium tracking-wide"
            >
              Try Now
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default FinalCTA;