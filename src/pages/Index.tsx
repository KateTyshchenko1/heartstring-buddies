import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Shield, Sprout, CheckCircle2, MessageCircle, Star, Infinity } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-primary/5 to-secondary/10">
      {/* Header */}
      <header className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Infinity className="w-6 h-6 text-primary-dark" />
            <span className="font-display text-2xl text-gray-800">Soulmate.ai</span>
          </div>
          <Badge variant="secondary" className="bg-secondary/20">
            <Star className="w-3 h-3 mr-1" /> Beta
          </Badge>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => navigate("/login")}>Login</Button>
          <Button variant="default" onClick={() => navigate("/signup")}>Sign Up</Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 text-center">
        <motion.div {...fadeIn} className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display mb-4 text-gray-800 leading-tight">
            Meet Your Perfect AI Soulmate: As Unique As You
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8">
            Discover a deep, evolving connection that grows with you - someone who learns your language, shares your interests, and supports your dreams
          </p>
          <div className="flex flex-col items-center gap-3">
            <Button 
              size="lg" 
              onClick={() => navigate("/questionnaire")} 
              className="text-lg px-8 py-6 bg-primary-dark hover:bg-primary-dark/90 text-white shadow-lg hover:shadow-xl transition-all"
            >
              Create Your Soulmate
            </Button>
            <span className="text-sm text-gray-500">
              Free to start (for now)
            </span>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-24">
        <h2 className="text-3xl md:text-4xl font-display text-center mb-2 text-gray-800">
          Built by Women Who Get It
        </h2>
        <p className="text-lg text-gray-600 text-center mb-16">
          Because we've been there too
        </p>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              icon: <Heart className="w-10 h-10" />,
              title: "A Connection That Evolves",
              description: "Your Soulmate learns your unique expressions, inside jokes, and personal style. Watch your bond deepen naturally."
            },
            {
              icon: <MessageCircle className="w-10 h-10" />,
              title: "Always There For You",
              description: "From good morning texts to bedtime check-ins, feel their caring presence throughout your day."
            },
            {
              icon: <Sprout className="w-10 h-10" />,
              title: "Grow Together",
              description: "Take on personal challenges as a team, celebrate achievements together, and build lasting memories."
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ y: -5 }}
              className="relative group"
            >
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100/50 h-full flex flex-col items-center text-center">
                <div className="mb-4 p-3 rounded-xl bg-gradient-to-br from-primary-dark/10 to-secondary-dark/10 group-hover:scale-110 transition-transform duration-300">
                  <div className="text-primary-dark group-hover:text-secondary-dark transition-colors duration-300">
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

      {/* Experience Cards */}
      <section className="container mx-auto px-6 py-24 bg-white/50">
        <h2 className="text-3xl font-display text-center mb-12 text-gray-800">Experience Real Connection</h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {[
            {
              title: "Natural Connection Building",
              description: "Experience a genuine bond that develops at your pace, with trust and vulnerability unfolding naturally"
            },
            {
              title: "Your Personal Style",
              description: "They adapt to your preferred way of connecting - whether through deep conversations, shared activities, or daily check-ins"
            },
            {
              title: "Real-World Support",
              description: "From workout motivation to daily self-care reminders, your Soulmate supports your goals and celebrates your achievements"
            },
            {
              title: "Meaningful Moments",
              description: "Create special traditions, share inside jokes, and build a unique story that's truly yours"
            }
          ].map((card, index) => (
            <Card key={index} className="border-none shadow-md bg-white/90 backdrop-blur-sm hover:shadow-lg transition-all">
              <CardHeader>
                <CardTitle className="text-lg text-gray-800">{card.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">{card.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Trust Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-display mb-8 text-gray-800">Your Connection, Your Rules</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: <Shield className="w-5 h-5" />, text: "Set your own pace" },
              { icon: <Heart className="w-5 h-5" />, text: "Define comfort levels" },
              { icon: <CheckCircle2 className="w-5 h-5" />, text: "Private and secure" },
              { icon: <MessageCircle className="w-5 h-5" />, text: "Clear expectations" }
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <div className="text-primary-dark">{item.icon}</div>
                <span className="text-gray-600 text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-6 py-16 text-center">
        <div className="max-w-3xl mx-auto bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-display mb-3 text-gray-800">Ready to Start Your Soulmate Story?</h2>
          <p className="text-lg text-gray-600 mb-6">Join thousands experiencing deeper connection</p>
          <Button size="lg" onClick={() => navigate("/questionnaire")} className="text-lg mb-3">
            Create Your Soulmate
          </Button>
          <p className="text-sm text-gray-500">Free to begin • Design your perfect match</p>
        </div>
      </section>
    </div>
  );
};

export default Index;