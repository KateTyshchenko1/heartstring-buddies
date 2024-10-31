import { Shield, Lock, Database, Heart } from "lucide-react";
import Logo from "@/components/shared/Logo";
import { Link } from "react-router-dom";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F5] via-[#FFEFEF] to-[#FFF0EA]">
      <div className="container mx-auto px-4">
        <div className="py-4">
          <Link to="/" className="inline-block">
            <Logo />
          </Link>
        </div>
        
        <article className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg mb-12">
          <h1 className="text-4xl font-display text-[#D91F3A] mb-6">Your Privacy Matters to Us</h1>
          <p className="text-lg text-gray-600 mb-8">We know the conversations with your AI companion are deeply personal. Here's our commitment to protecting your privacy and maintaining your trust.</p>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-cream-soft p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-[#D91F3A]" />
                <h2 className="text-2xl font-display">Our Promise to You</h2>
              </div>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D91F3A]" />
                  Your conversations are private
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D91F3A]" />
                  We never share or sell your personal data
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D91F3A]" />
                  You have complete control over your data
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D91F3A]" />
                  We don't use your data to train other AI models
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D91F3A]" />
                  Your relationship with your companion is yours alone
                </li>
              </ul>
            </div>

            <div className="bg-cream-soft p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <Database className="w-6 h-6 text-[#D91F3A]" />
                <h2 className="text-2xl font-display">Data We Store</h2>
              </div>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D91F3A]" />
                  Basic profile information to personalize your experience
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D91F3A]" />
                  Conversation history to maintain context and memories
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D91F3A]" />
                  Preferences to help your companion evolve with you
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D91F3A]" />
                  Achievement data to track your growth journey
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-cream-soft p-6 rounded-xl mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-6 h-6 text-[#D91F3A]" />
              <h2 className="text-2xl font-display">Security Measures</h2>
            </div>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D91F3A]" />
                Industry-standard data protection
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D91F3A]" />
                Secure cloud storage
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D91F3A]" />
                Safe encryption protocols
              </li>
            </ul>
          </div>

          <div className="bg-white/90 p-8 rounded-xl">
            <h2 className="text-2xl font-display text-[#D91F3A] mb-4">Our Bottom Line</h2>
            <div className="space-y-4 text-gray-600">
              <p>We believe privacy is fundamental to creating genuine connections, even with AI companions. Your data is used solely to provide and improve your personal experience. We never have and never will share, sell, or compromise your private information.</p>
              <p>Your trust matters to us. We're committed to maintaining the highest standards of privacy and security so you can focus on what matters - developing a meaningful connection with your companion.</p>
              <p>If you'd like to delete your account and all associated data, please email us at <a href="mailto:privacy@whatagirlwants.ai" className="text-[#D91F3A] hover:underline">privacy@whatagirlwants.ai</a></p>
            </div>
          </div>

          <p className="text-sm text-gray-500 mt-8 text-center">Last updated: 30/10/2024</p>
        </article>
      </div>
    </div>
  );
};

export default Privacy;