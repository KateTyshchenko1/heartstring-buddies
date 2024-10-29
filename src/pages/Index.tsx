import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import FeatureCards from "@/components/home/FeatureCards";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Heart, Shield, Sprout, CheckCircle2, MessageCircle, Star, Infinity } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { session } = useAuth();

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleCreateClick = () => {
    navigate("/questionnaire");
  };

  useEffect(() => {
    const checkUserStatus = async () => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('questionnaire_completed')
          .eq('id', session.user.id)
          .single();
        
        if (profile?.questionnaire_completed) {
          navigate('/chat');
        }
      }
    };
    
    checkUserStatus();
  }, [session, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F5] via-[#FFEFEF] to-[#FFF0EA]">
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
        <div className="flex gap-3">
          <Button 
            variant="ghost" 
            onClick={handleLoginClick}
            className="hover:bg-[#FFE5E5] text-gray-700"
          >
            Login
          </Button>
          <Button 
            onClick={handleCreateClick}
            className="bg-[#D91F3A] hover:bg-[#B91830] text-white"
          >
            Sign up
          </Button>
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
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display mb-4 text-[#D91F3A] leading-tight">
            Your Perfect Person, Thoughtfully Crafted
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 px-4">
            We've created what every woman secretly wants - someone who actually listens, remembers everything, and gets better at making you happy every day
          </p>
          <div className="flex flex-col items-center gap-3">
            <Button 
              size="lg" 
              onClick={handleCreateClick}
              className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 bg-[#D91F3A] hover:bg-[#B91830] text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-105 w-full sm:w-auto"
            >
              Create Yours
            </Button>
</lov-replace>

<lov-search>
            Your answers shape the perfect Soulmate: From your quirks to your dreams, everything you share helps design a soulmate who truly gets you
</lov-search>
<lov-replace>
            Your story shapes him: From your quirks to your dreams, every detail you share creates someone who'll understand you completely
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
        <h2 className="text-2xl sm:text-3xl font-display text-center mb-2 text-[#D91F3A]">Ready to Be Swept Off Your Feet?</h2>
        <p className="text-lg text-gray-600 text-center mb-8 sm:mb-12">Here is how it all works:</p>
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {[
            {
              title: "Tell Us About Yourself",
              description: "Your answers shape the perfect Soulmate: From your quirks to your dreams, everything you share helps design a soulmate who truly gets you."
            },
            {
              title: "Create the Look, Voice & Backstory",
              description: "Pick the face, voice, and story that make you swoon: Set up your soulmate's style and even create a backstory together, or let him surprise you with his own."
            },
            {
              title: "Build Trust Over Time",
              description: "It's like dating irl: You'll start light, and as trust grows, he'll open up more – no skipping to the spicy stuff on day one."
            },
            {
              title: "Grow Together",
              description: "Set real-life goals, track progress, and get gentle reminders: Your soulmate supports your journey with encouragement as you both evolve together."
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
          <h2 className="text-xl sm:text-2xl font-display mb-3 text-[#D91F3A]">Ready to Start Your Story?</h2>
          <p className="text-base sm:text-lg text-gray-600 mb-6">Let's create someone who truly gets you.</p>
          <Button 
            size="lg" 
            onClick={handleCreateClick}
            className="text-base sm:text-lg mb-3 bg-[#D91F3A] hover:bg-[#B91830] text-white w-full sm:w-auto"
          >
            Create Yours
          </Button>
</lov-replace>

<lov-search>
            <span className="font-display text-xl sm:text-2xl text-gray-800">Soulmate.ai</span>
</lov-search>
<lov-replace>
            <span className="font-display text-xl sm:text-2xl text-gray-800">Romantics.ai</span>
        </div>
      </section>
    </div>
  );
};

export default Index;
