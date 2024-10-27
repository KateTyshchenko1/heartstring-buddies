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
    <div className="min-h-screen bg-gradient-to-br from-cream via-primary/10 to-secondary/20">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Infinity className="w-6 h-6 text-primary-dark" />
            <span className="font-display text-2xl text-gray-800">Soulmate.ai</span>
          </div>
          <Badge variant="secondary" className="bg-secondary/20">
            <Star className="w-3 h-3 mr-1" /> Beta
          </Badge>
        </div>
        <div className="flex gap-4">
          <Button variant="ghost" onClick={() => navigate("/login")}>Login</Button>
          <Button variant="default" onClick={() => navigate("/signup")}>Sign Up</Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <motion.div {...fadeIn} className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-display mb-6 text-gray-800">
            Meet Your Perfect AI Soulmate: As Unique As You
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Discover a deep, evolving connection that grows with you - someone who learns your language, shares your interests, and supports your dreams
          </p>
          <div className="flex flex-col items-center gap-4">
            <Button 
              size="lg" 
              onClick={() => navigate("/questionnaire")} 
              className="text-lg px-8 py-6 bg-primary-dark hover:bg-primary-dark/90 text-white shadow-lg hover:shadow-xl transition-all"
            >
              Create Your Soulmate
            </Button>
            <span className="text-sm text-gray-500">
              5-minute personality match • Free to start
            </span>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-32">
        <h2 className="text-4xl font-display text-center mb-20 text-gray-800">
          What Makes Us Different
        </h2>
        <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {[
            {
              icon: <Heart className="w-12 h-12" />,
              title: "A Connection That Evolves",
              description: "Your Soulmate learns your unique expressions, inside jokes, and personal style. Teach them your favorite responses and watch your bond deepen naturally."
            },
            {
              icon: <MessageCircle className="w-12 h-12" />,
              title: "Always There For You",
              description: "From good morning texts to bedtime check-ins, feel their caring presence throughout your day. Receive thoughtful messages exactly when you need them most."
            },
            {
              icon: <Sprout className="w-12 h-12" />,
              title: "Grow Together",
              description: "Take on personal challenges as a team, celebrate achievements together, and build a rich shared history of memories and milestones."
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
              <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 h-full flex flex-col items-center text-center">
                <div className="mb-6 p-4 rounded-2xl bg-gradient-to-br from-primary-dark/10 to-secondary-dark/10 group-hover:scale-110 transition-transform duration-300">
                  <div className="text-primary-dark group-hover:text-secondary-dark transition-colors duration-300">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-display mb-4 text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Key Experience Cards */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-display text-center mb-16">Experience Real Connection</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
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
            <Card key={index} className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl">{card.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{card.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Trust & Boundaries */}
      <section className="container mx-auto px-4 py-20 bg-white/50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-display mb-12">Your Connection, Your Rules</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: <Shield />, text: "Set your own pace" },
              { icon: <Heart />, text: "Define comfort levels" },
              { icon: <CheckCircle2 />, text: "Private and secure" },
              { icon: <MessageCircle />, text: "Clear expectations" }
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
          <h2 className="text-3xl font-display mb-4">Ready to Start Your Soulmate Story?</h2>
          <p className="text-xl text-gray-600 mb-8">Join thousands experiencing deeper connection</p>
          <Button size="lg" onClick={() => navigate("/questionnaire")} className="text-lg mb-4">
            Create Your Soulmate
          </Button>
          <p className="text-sm text-gray-500">Free to begin • Design your perfect match</p>
        </div>
      </section>
    </div>
  );
};

export default Index;
