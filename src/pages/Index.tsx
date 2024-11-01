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

      <section className="container mx-auto px-4 sm:px-6 pt-2 sm:pt-4 pb-6 sm:pb-8 text-center border-b border-gray-100">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-[1400px] mx-auto"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-left md:pr-12 lg:pr-32 flex flex-col items-start sm:items-start max-w-[700px]">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-display text-[#D91F3A] leading-tight">
                Your Perfect Person, Thoughtfully Crafted
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 mt-6 mb-8 max-w-[600px]">
                An empathetic AI companion that listens, understands, and grows with you—because everyone deserves to feel heard.
              </p>
              <div className="w-full sm:w-auto flex justify-center sm:justify-start">
                <Button 
                  size="lg" 
                  onClick={handleCreateClick}
                  className="text-lg px-8 py-6 bg-[#D91F3A] hover:bg-[#B91830] text-white shadow-lg hover:shadow-xl transition-all font-medium tracking-wide"
                >
                  Create Yours
                </Button>
              </div>
            </div>
            <div className="relative flex justify-center items-center md:justify-end">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="max-w-[400px]"
              >
                <img 
                  src="https://res.cloudinary.com/djzoneohv/image/upload/v1730487315/Text_Message_Animation_Conversation_Quote_Instagram_Story_v7je2p.gif" 
                  alt="AI Companion Animation" 
                  className="w-full h-auto"
                />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      <div className="space-y-8">
        <FeatureCards />
        <ExperienceCards />
        <FinalCTA onTryNowClick={handleCreateClick} />
      </div>
    </div>
  );
};

export default Index;