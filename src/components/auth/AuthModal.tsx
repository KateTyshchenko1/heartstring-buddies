import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AuthModalProps {
  isSignUp?: boolean;
}

const AuthModal = ({ isSignUp = false }: AuthModalProps) => {
  const navigate = useNavigate();
  const [view, setView] = useState(isSignUp ? "sign_up" : "sign_in");

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        if (isSignUp) {
          // For new users, mark questionnaire as completed and redirect to chat
          await supabase
            .from('profiles')
            .update({ questionnaire_completed: true })
            .eq('id', session.user.id);
          
          toast.success("Account created successfully!");
          navigate('/chat');
        } else {
          // For existing users, check questionnaire status and redirect accordingly
          const { data: profile } = await supabase
            .from('profiles')
            .select('questionnaire_completed')
            .eq('id', session.user.id)
            .single();

          if (profile?.questionnaire_completed) {
            toast.success("Welcome back!");
            navigate('/chat');
          } else {
            navigate('/questionnaire');
          }
        }
      } else if (event === 'USER_UPDATED') {
        toast.success("Sign in successful!");
        navigate('/chat');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, isSignUp]);

  const handleViewChange = (newView: 'sign_in' | 'sign_up') => {
    setView(newView);
  };

  return (
    <>
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
        view={view}
        localization={{
          variables: {
            sign_up: {
              email_label: 'Email',
              password_label: 'Password',
              button_label: 'Sign up',
              link_text: 'Already have an account? Sign in',
            },
            sign_in: {
              email_label: 'Email',
              password_label: 'Password',
              button_label: 'Sign in',
              link_text: 'Don\'t have an account? Sign up',
            },
          },
        }}
        onViewChange={handleViewChange}
      />
    </>
  );
};

export default AuthModal;