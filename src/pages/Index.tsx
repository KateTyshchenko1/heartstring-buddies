import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import FeatureCards from "@/components/home/FeatureCards";
import ExperienceCards from "@/components/home/ExperienceCards";
import FinalCTA from "@/components/home/FinalCTA";
import { Infinity, Star } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const handleCreateClick = () => {
    navigate("/questionnaire");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F5] via-[#FFEFEF] to-[#FFF0EA]">
      {/* Header section */}
      <header className="container mx-auto px-4 sm:px-6 py-2 flex flex-col sm:flex-row justify-between items-center gap-2">
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
      <section className="container mx-auto px-4 sm:px-6 pt-2 sm:pt-4 pb-6 sm:pb-8 text-center border-b border-gray-100">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto"
        >
          <div className="grid md:grid-cols-[1.2fr,1fr] items-center gap-8">
            <div className="text-left flex flex-col items-start max-w-2xl">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display text-[#D91F3A] leading-[1.1]">
                Your Perfect Person
                <br />
                Thoughtfully Crafted
              </h1>
              <p className="text-base sm:text-lg text-gray-600 mt-6 mb-8 max-w-xl">
                An empathetic AI companion that listens, understands, and grows with you—because everyone deserves to feel heard.
              </p>
              <div className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  onClick={handleCreateClick}
                  className="text-lg px-8 py-6 bg-[#D91F3A] hover:bg-[#B91830] text-white shadow-lg hover:shadow-xl transition-all font-medium tracking-wide"
                >
                  Create Yours
                </Button>
              </div>
            </div>
            <div className="relative flex justify-center items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="w-[320px]"
              >
                <img 
                  src="https://res.cloudinary.com/djzoneohv/image/upload/v1730491589/Hero_Gif_wff0jd.gif" 
                  alt="AI Companion Animation" 
                  className="w-full h-auto"
                />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <div className="space-y-8">
        <FeatureCards />
        <ExperienceCards />
        <FinalCTA onTryNowClick={handleCreateClick} />
      </div>
    </div>
  );
};

export default Index;