import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

const experienceCards = [
  {
    title: "Personalize Your Companion",
    description: "Answer 10 questions to help you build your perfect companion. From things like personality traits to communication style."
  },
  {
    title: "Start the Conversation",
    description: "Open up about your day, your challenges, or anything on your mind. Your companion listens attentively and provides thoughtful, caring replies."
  },
  {
    title: "Ongoing Support",
    description: [
      {
        subtitle: "24/7 Availability:",
        text: "Access your companion whenever you need support—day or night."
      },
      {
        subtitle: "Continuous Growth:",
        text: "The more you interact, the better your companion understands and supports you."
      }
    ]
  }
];

const ExperienceCards = () => {
  return (
    <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 bg-gradient-to-br from-white/80 to-[#FFD7D0]/20">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-lg sm:text-xl md:text-2xl font-display text-center mb-4 text-[#D91F3A] leading-tight"
      >
        Design your companion in less than 5 minutes
      </motion.h2>
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-sm md:text-base text-gray-600 text-center mb-6 sm:mb-8"
      >
        Here is how it all works:
      </motion.p>

      <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
        {experienceCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="border-none shadow-md bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full">
              <CardHeader className="p-6">
                <CardTitle className="text-base sm:text-lg font-display mb-4 text-[#D91F3A]">
                  {card.title}
                </CardTitle>
                {typeof card.description === 'string' ? (
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {card.description}
                  </p>
                ) : (
                  <div className="space-y-4">
                    {card.description.map((item, idx) => (
                      <div key={idx} className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-800">{item.subtitle}</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {item.text}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardHeader>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ExperienceCards;