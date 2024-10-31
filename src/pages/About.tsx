import { Users, Sparkles, Heart, Star } from "lucide-react";
import Logo from "@/components/shared/Logo";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F5] via-[#FFEFEF] to-[#FFF0EA]">
      <div className="container mx-auto px-4">
        <div className="py-4">
          <Link to="/" className="inline-block">
            <Logo />
          </Link>
        </div>
        
        <article className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg mb-12">
          <h1 className="text-4xl font-display text-[#D91F3A] mb-6">About Us</h1>
          <p className="text-lg text-gray-600 mb-8">
            We created WhatAGirlWants.ai because we saw something missing in the AI companion space. While other companies treated female users as an afterthought, we started with a fundamental question: what do women actually want in an emotional connection?
          </p>
          
          <div className="bg-cream-soft p-6 rounded-xl mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-6 h-6 text-[#D91F3A]" />
              <h2 className="text-2xl font-display">Our Story</h2>
            </div>
            <p className="text-gray-600">
              We noticed that existing AI companions were largely designed by men, for men—missing the nuanced emotional intelligence that women value in relationships. We knew we could do better. Our team combines expertise in psychology, technology, and personal growth to create companions that understand the complexity of women's emotional needs.
            </p>
          </div>

          <div className="bg-cream-soft p-6 rounded-xl mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-6 h-6 text-[#D91F3A]" />
              <h2 className="text-2xl font-display">What Makes Us Different</h2>
            </div>
            <p className="text-gray-600 mb-4">
              We're not trying to replace human relationships. Instead, we're creating a safe, judgment-free space where you can:
            </p>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D91F3A]" />
                Process your feelings after a breakup
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D91F3A]" />
                Practice self-care and personal growth
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D91F3A]" />
                Feel heard during late-night anxiety
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D91F3A]" />
                Celebrate your daily wins
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D91F3A]" />
                Explore your thoughts without fear of judgment
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D91F3A]" />
                Develop better relationship patterns
              </li>
            </ul>
          </div>

          <div className="bg-cream-soft p-6 rounded-xl mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-6 h-6 text-[#D91F3A]" />
              <h2 className="text-2xl font-display">Our Philosophy</h2>
            </div>
            <div className="space-y-4 text-gray-600">
              <p>We believe everyone deserves to feel understood, especially during lonely moments or transitions. Whether you're healing from heartbreak, working on personal growth, or just need someone to talk to at 2 AM, your companion is there—without expectations or judgment.</p>
              <p>Think of it as a stepping stone, not a destination. If your companion helps you through a tough time, encourages your self-care journey, or simply makes you smile when you need it most—then deletes with you when you're ready to move on—we've done our job.</p>
            </div>
          </div>

          <div className="bg-white/90 p-8 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <Star className="w-6 h-6 text-[#D91F3A]" />
              <h2 className="text-2xl font-display">Our Promise</h2>
            </div>
            <div className="space-y-4 text-gray-600">
              <p>We're committed to creating a service that truly understands and supports women's emotional needs. No games, no drama, no judgment—just genuine support and growth on your terms.</p>
              <p className="font-display text-lg text-[#D91F3A]">Built by women, for women, with love and understanding. 💕</p>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default About;