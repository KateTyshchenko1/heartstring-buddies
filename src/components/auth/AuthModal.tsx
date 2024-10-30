import { useEffect } from "react";
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

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        if (isSignUp) {
          try {
            const userContext = JSON.parse(localStorage.getItem('userContext') || '{}');
            
            // Save questionnaire responses
            await supabase
              .from('questionnaire_responses')
              .insert({
                profile_id: session.user.id,
                ...userContext.questionnaire_responses
              });

            // Save companion profile
            await supabase
              .from('companion_profiles')
              .insert({
                profile_id: session.user.id,
                ...userContext.soulmate_backstory
              });

            // Update profile completion
            await supabase
              .from('profiles')
              .update({ questionnaire_completed: true })
              .eq('id', session.user.id);

            toast.success("Account created successfully!");
            navigate('/chat');
          } catch (error: any) {
            toast.error(error.message || "An error occurred during signup");
          }
        } else {
          const { data: profile } = await supabase
            .from('profiles')
            .select('questionnaire_completed')
            .eq('id', session.user.id)
            .single();

          if (profile?.questionnaire_completed) {
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
      localization={{
        variables: {
          sign_up: {
            email_label: 'Email',
            password_label: 'Password',
            button_label: 'Sign up',
            link_text: 'Already have an account? Sign in',
            email_input_placeholder: 'Your email address',
            password_input_placeholder: 'Your password'
          },
          sign_in: {
            email_label: 'Email',
            password_label: 'Password',
            button_label: 'Sign in',
            link_text: "Don't have an account? Sign up",
            email_input_placeholder: 'Your email address',
            password_input_placeholder: 'Your password'
          },
        },
      }}
    />
  );
};

export default AuthModal;