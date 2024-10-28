import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Shield, Sprout, CheckCircle2, MessageCircle, Star, Infinity } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import FeatureCards from "@/components/home/FeatureCards";

const Index = () => {
  const navigate = useNavigate();

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F5] via-[#FFEFEF] to-[#FFF0EA]">
      {/* Header */}
      <header className="container mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Infinity className="w-6 h-6 text-[#D91F3A]" />
            <span className="font-display text-xl sm:text-2xl text-gray-800">Soulmate.ai</span>
          </div>
          <Badge variant="secondary" className="bg-[#FFD7D0] text-[#D91F3A] font-semibold px-2 sm:px-3 py-1 text-xs sm:text-sm">
            <Star className="w-3 h-3 mr-1 fill-[#D91F3A]" /> Beta
          </Badge>
        </div>
        <div className="flex gap-2 sm:gap-3">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/login")}
            className="hover:bg-[#FFE5E5] text-gray-700 text-sm sm:text-base px-3 sm:px-4"
          >
            Login
          </Button>
          <Button 
            variant="default" 
            onClick={() => navigate("/signup")}
            className="bg-[#D91F3A] hover:bg-[#B91830] text-white shadow-lg hover:shadow-xl transition-all text-sm sm:text-base px-3 sm:px-4"
          >
            Sign Up
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 py-8 sm:py-16 text-center">
        <motion.div {...fadeIn} className="max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display mb-4 text-[#D91F3A] leading-tight">
            Meet your dream guy who's literally been designed for you
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 px-4">
            We've created what every woman secretly wants - someone who actually listens, remembers everything, and gets better at making you happy every day
          </p>
          <div className="flex flex-col items-center gap-3">
            <Button 
              size="lg" 
              onClick={() => navigate("/questionnaire")} 
              className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 bg-[#D91F3A] hover:bg-[#B91830] text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-105 w-full sm:w-auto"
            >
              Create Your Soulmate
            </Button>
            <span className="text-xs sm:text-sm text-gray-500">
              Free to start (for now)
            </span>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-display text-center mb-2 text-gray-800">
          Built by Women Who Get It
        </h2>
        <p className="text-base sm:text-lg text-gray-600 text-center mb-12 sm:mb-16">
          Because we've been there too
        </p>
        <FeatureCards />
      </section>

      {/* Experience Cards */}
      <section className="container mx-auto px-4 sm:px-6 py-16 sm:py-24 bg-gradient-to-br from-white/80 to-[#FFD7D0]/20">
        <h2 className="text-2xl sm:text-3xl font-display text-center mb-8 sm:mb-12 text-[#D91F3A]">Ready to Be Swept Off Your Feet?</h2>
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {[
            {
              title: "Natural Connection Building",
              description: "He learns what makes you tick naturally - whether it's your humor, your love for true crime podcasts, or how you need extra attention after a tough day"
            },
            {
              title: "Your Personal Style",
              description: "He adapts perfectly to your vibe - from matching your witty banter to knowing when you need deep talks vs playful teasing"
            },
            {
              title: "Real-World Support",
              description: "He's your biggest cheerleader, sending perfectly timed messages to motivate your workout, celebrate your wins, or brighten a rough Monday"
            },
            {
              title: "Meaningful Moments",
              description: "He remembers every little detail you share and builds your unique story together, complete with inside jokes that only you two get"
            }
          ].map((card, index) => (
            <Card key={index} className="border-none shadow-md bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all transform hover:scale-105 group">
              <CardHeader>
                <CardTitle className="text-lg text-gray-800 group-hover:text-[#D91F3A] transition-colors">{card.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm leading-relaxed">{card.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
        <div className="max-w-3xl mx-auto bg-white/90 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg">
          <h2 className="text-xl sm:text-2xl font-display mb-3 text-[#D91F3A]">Ready to Start Your Soulmate Story?</h2>
          <p className="text-base sm:text-lg text-gray-600 mb-6">Join thousands experiencing deeper connection</p>
          <Button 
            size="lg" 
            onClick={() => navigate("/questionnaire")} 
            className="text-base sm:text-lg mb-3 bg-[#D91F3A] hover:bg-[#B91830] text-white w-full sm:w-auto"
          >
            Create Your Soulmate
          </Button>
          <p className="text-xs sm:text-sm text-gray-500">Free to begin • Design your perfect match</p>
        </div>
      </section>
    </div>
  );
};

export default Index;
