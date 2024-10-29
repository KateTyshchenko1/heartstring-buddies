import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "@/components/shared/Logo";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import AuthModal from "@/components/auth/AuthModal";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('questionnaire_completed')
          .eq('id', session.user.id)
          .single();

        if (profile?.questionnaire_completed) {
          navigate("/chat");
        } else {
          navigate("/questionnaire");
        }
      }

      if (event === "PASSWORD_RECOVERY") {
        const error = new URLSearchParams(window.location.search).get('error_description');
        if (error) {
          if (error.includes('rate_limit')) {
            toast.error("Please wait a moment before requesting another reset link");
          } else {
            toast.error(error);
          }
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
        <AuthModal isSignUp={false} />
      </div>
    </div>
  );
};

export default Login;