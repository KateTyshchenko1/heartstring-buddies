import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Logo from "@/components/shared/Logo";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const navigate = useNavigate();

  const checkQuestionnaireStatus = async (userId: string) => {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('questionnaire_completed')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error checking questionnaire status:', error);
      return false;
    }

    return profile?.questionnaire_completed ?? false;
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        const hasCompletedQuestionnaire = await checkQuestionnaireStatus(session.user.id);
        if (hasCompletedQuestionnaire) {
          navigate("/chat");
        } else {
          navigate("/questionnaire");
        }
      }
    });

    // Check if user is already signed in
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        const hasCompletedQuestionnaire = await checkQuestionnaireStatus(session.user.id);
        if (hasCompletedQuestionnaire) {
          navigate("/chat");
        } else {
          navigate("/questionnaire");
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F5] via-[#FFEFEF] to-[#FFF0EA] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>
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
          theme="light"
        />
      </div>
    </div>
  );
};

export default Login;