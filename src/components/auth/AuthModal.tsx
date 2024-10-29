import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AuthModalProps {
  isSignUp?: boolean;
}

const AuthModal = ({ isSignUp = false }: AuthModalProps) => {
  const navigate = useNavigate();

  const handleAuthSuccess = async () => {
    const userContext = localStorage.getItem('userContext');
    if (userContext) {
      const { data, error } = await supabase
        .from('profiles')
        .update({ questionnaire_completed: true })
        .eq('id', (await supabase.auth.getUser()).data.user?.id);

      if (!error) {
        navigate('/chat');
      }
    }
  };

  return (
    <div className="w-full max-w-md bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-display mb-6 text-center">
        {isSignUp ? "Create Your Account" : "Welcome Back"}
      </h2>
      <Auth
        supabaseClient={supabase}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: '#D91F3A',
                brandAccent: '#B91830',
              }
            }
          },
          className: {
            container: 'auth-container',
            button: 'auth-button',
            input: 'auth-input',
          }
        }}
        providers={[]}
        view={isSignUp ? "sign_up" : "sign_in"}
        redirectTo={`${window.location.origin}/chat`}
        onSuccess={handleAuthSuccess}
        theme="light"
      />
    </div>
  );
};

export default AuthModal;