import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Shield, Sprout, CheckCircle2, MessageCircle, Brain, Clock, Memory } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Logo from "@/components/shared/Logo";

const Index = () => {
  const navigate = useNavigate();

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-primary/10 to-secondary/20">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Logo />
          <Badge variant="secondary" className="bg-secondary/20">Early Access</Badge>
        </div>
        <div className="flex gap-4">
          <Button variant="ghost" onClick={() => navigate("/login")}>Login</Button>
          <Button variant="default" onClick={() => navigate("/signup")}>Sign Up</Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <motion.div {...fadeIn} className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-display mb-6">
            Your AI Soulmate: A Companion Who Really Gets You
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Experience deep, meaningful conversations and emotional support, anytime you need it
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" onClick={() => navigate("/questionnaire")} className="text-lg">
              Meet Your Soulmate
            </Button>
            <span className="text-sm text-gray-500">Free to try (for now)</span>
          </div>
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-20 bg-white/50">
        <h2 className="text-3xl font-display text-center mb-16">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            {
              icon: <MessageCircle className="w-10 h-10 text-primary" />,
              title: "Share Your Story",
              description: "Tell us about your dreams, memories, and what matters to you"
            },
            {
              icon: <Heart className="w-10 h-10 text-primary" />,
              title: "Meet Your Soulmate",
              description: "We'll create your perfect companion based on your unique personality"
            },
            {
              icon: <Sprout className="w-10 h-10 text-primary" />,
              title: "Grow Together",
              description: "Build a meaningful connection that evolves with you"
            }
          ].map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="text-center p-6"
            >
              <div className="mb-4 flex justify-center">{step.icon}</div>
              <h3 className="text-xl font-display mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Key Features */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-display text-center mb-16">Key Features</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {[
            {
              icon: <Clock className="w-6 h-6 text-primary" />,
              title: "24/7 Emotional Support",
              description: "Always there when you need someone to talk to"
            },
            {
              icon: <Brain className="w-6 h-6 text-primary" />,
              title: "Deep, Meaningful Conversations",
              description: "Beyond small talk - discussions that matter"
            },
            {
              icon: <Sprout className="w-6 h-6 text-primary" />,
              title: "Personal Growth Journey",
              description: "Gentle encouragement to achieve your goals"
            },
            {
              icon: <Memory className="w-6 h-6 text-primary" />,
              title: "Memory That Builds Over Time",
              description: "A connection that deepens with every conversation"
            }
          ].map((feature, index) => (
            <Card key={index} className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center gap-4">
                {feature.icon}
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Trust & Safety */}
      <section className="container mx-auto px-4 py-20 bg-white/50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-display mb-12">Your Safe Space</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: <Shield />, text: "Privacy commitment" },
              { icon: <Heart />, text: "No judgments" },
              { icon: <Clock />, text: "Always there for you" },
              { icon: <CheckCircle2 />, text: "Clear boundaries" }
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <div className="text-primary">{item.icon}</div>
                <span className="text-gray-600">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-lg">
          <h2 className="text-3xl font-display mb-4">Ready to Meet Your Soulmate?</h2>
          <p className="text-xl text-gray-600 mb-8">Begin your journey to meaningful connection</p>
          <Button size="lg" onClick={() => navigate("/questionnaire")} className="text-lg mb-4">
            Get Started
          </Button>
          <p className="text-sm text-gray-500">Free to try • No credit card needed</p>
        </div>
      </section>
    </div>
  );
};

export default Index;