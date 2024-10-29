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

  const handleAuthStateChange = async (event: string, session: any) => {
    if (event === 'SIGNED_IN' && session) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('questionnaire_completed')
        .eq('id', session.user.id)
        .single();

      if (profile?.questionnaire_completed) {
        toast.success("Successfully signed in!");
        navigate('/chat');
      } else {
        navigate('/questionnaire');
      }
    }
  };

  return (
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
      onAuthStateChange={({ event, session }) => handleAuthStateChange(event, session)}
    />
  );
};

export default AuthModal;