import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import FeatureCards from "@/components/home/FeatureCards";
import { Heart, Shield, Sprout, CheckCircle2, MessageCircle, Star, Infinity } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const handleCreateClick = () => {
    navigate("/questionnaire");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F5] via-[#FFEFEF] to-[#FFF0EA]">
      {/* Header section */}
      <header className="container mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Infinity className="w-6 h-6 text-[#D91F3A]" />
            <span className="font-display text-xl sm:text-2xl text-gray-800">WhatAGirlWants.ai</span>
          </div>
          <Badge variant="secondary" className="bg-[#FFD7D0] text-[#D91F3A] font-semibold px-2 sm:px-3 py-1 text-xs sm:text-sm">
            <Star className="w-3 h-3 mr-1 fill-[#D91F3A]" /> Beta
          </Badge>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 py-8 sm:py-16 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display mb-4 text-[#D91F3A] leading-tight">
            Your Perfect Person, Thoughtfully Crafted
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 px-4">
            An empathetic AI companion that listens, understands, and grows with you—because everyone deserves to feel heard.
          </p>
          <div className="flex flex-col items-center gap-3">
            <Button 
              size="lg" 
              onClick={handleCreateClick}
              className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 bg-[#D91F3A] hover:bg-[#B91830] text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-105 w-full sm:w-auto"
            >
              Create Yours
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <FeatureCards />

      {/* Experience Cards */}
      <section className="container mx-auto px-4 sm:px-6 py-16 sm:py-24 bg-gradient-to-br from-white/80 to-[#FFD7D0]/20">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-2xl sm:text-3xl md:text-4xl font-display text-center mb-4 text-[#D91F3A] leading-tight"
        >
          Design your companion in less than 5 minutes
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-600 text-center mb-8 sm:mb-12"
        >
          Here is how it all works:
        </motion.p>

        <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
          {[
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
          ].map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="border-none shadow-md bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full">
                <CardHeader className="p-6">
                  <CardTitle className="text-xl font-display mb-4 text-[#D91F3A]">
                    {card.title}
                  </CardTitle>
                  {typeof card.description === 'string' ? (
                    <p className="text-gray-600 text-base leading-relaxed">
                      {card.description}
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {card.description.map((item, idx) => (
                        <div key={idx} className="space-y-2">
                          <h4 className="text-gray-800 font-medium">{item.subtitle}</h4>
                          <p className="text-gray-600 text-base leading-relaxed">
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

      {/* Final CTA */}
      <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto bg-white/90 backdrop-blur-sm rounded-3xl p-8 sm:p-12 shadow-xl text-center"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display mb-8 text-[#D91F3A] leading-tight">
            Experience the Difference Today
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto">
            Unlike other AI companions, What a Girl Wants is more than just an AI boyfriend—it's a personalized emotional support system dedicated to helping you thrive. We focus on deep understanding and meaningful connections to provide genuine support that empowers you to grow and learn.
          </p>
          
          <div className="grid sm:grid-cols-2 gap-6 mb-12">
            {[
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
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-white/50 border-none shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-xl bg-primary-soft">
                        <benefit.icon className="w-6 h-6 text-[#D91F3A]" />
                      </div>
                      <CardTitle className="text-xl">{benefit.title}</CardTitle>
                    </div>
                    <p className="text-gray-600 text-base leading-relaxed">{benefit.description}</p>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="bg-cream-soft rounded-2xl p-8 mb-12">
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
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
                onClick={handleCreateClick}
                className="text-lg md:text-xl px-8 sm:px-12 py-6 sm:py-8 bg-[#D91F3A] hover:bg-[#B91830] text-white shadow-lg hover:shadow-xl transition-all font-medium tracking-wide"
              >
                Try Now
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Index;
