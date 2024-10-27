import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { GoogleOAuthProvider } from '@react-oauth/google';
import GoogleSignInButton from "./GoogleSignInButton";
import { Separator } from "@/components/ui/separator";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

const AuthModal = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(isLogin ? "Welcome back!" : "Account created successfully!");
    navigate("/questionnaire");
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-secondary/20 w-full max-w-md animate-fade-in">
        <h2 className="text-2xl font-display mb-6 text-center">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>
        
        <GoogleSignInButton />
        
        <div className="relative my-6">
          <Separator />
          <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-sm text-gray-500">
            or continue with email
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
              required
            />
          </div>
          <button type="submit" className="primary-button w-full">
            {isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>
        
        <p className="text-center mt-4 text-sm text-gray-600">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary hover:text-primary-dark font-medium"
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </div>
    </GoogleOAuthProvider>
  );
};

export default AuthModal;