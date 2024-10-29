import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { toast } from "sonner";

interface AuthModalProps {
  isSignUp?: boolean;
}

const AuthModal = ({ isSignUp = false }: AuthModalProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('questionnaire_completed')
          .eq('id', session.user.id)
          .single();

        if (isSignUp) {
          // For new users, mark questionnaire as completed and redirect to chat
          await supabase
            .from('profiles')
            .update({ questionnaire_completed: true })
            .eq('id', session.user.id);
          
          toast.success("Account created successfully!");
          navigate('/chat');
        } else {
          // For existing users, check questionnaire status
          if (profile?.questionnaire_completed) {
            toast.success("Welcome back!");
            navigate('/chat');
          } else {
            navigate('/questionnaire');
          }
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, isSignUp]);

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
    />
  );
};

export default AuthModal;