import Logo from "@/components/shared/Logo";
import AuthModal from "@/components/auth/AuthModal";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-primary/10 to-secondary/20">
      <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-screen">
        <div className="text-center mb-12 animate-fade-in">
          <Logo />
          <h1 className="text-4xl md:text-5xl font-display mt-6 mb-4">
            Your AI Companion for
            <br />
            Emotional Support
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Experience meaningful conversations and genuine connection with your
            personal AI companion who understands and supports you.
          </p>
        </div>
        
        <AuthModal />
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl w-full animate-slide-up">
          <Feature
            title="Always There"
            description="24/7 emotional support and companionship whenever you need it"
          />
          <Feature
            title="Remembers Everything"
            description="Your companion learns about you and grows with every conversation"
          />
          <Feature
            title="Judgment-Free"
            description="Share your thoughts freely in a safe, accepting space"
          />
        </div>
      </div>
    </div>
  );
};

const Feature = ({ title, description }: { title: string; description: string }) => (
  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 text-center">
    <h3 className="font-display text-xl mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default Index;