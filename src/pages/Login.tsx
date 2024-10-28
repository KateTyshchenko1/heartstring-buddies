import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "@/components/shared/Logo";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        toast.success("Successfully signed in!");
        navigate("/questionnaire");
      } else if (event === "SIGNED_OUT") {
        navigate("/login");
      } else if (event === "USER_UPDATED") {
        console.log("User updated:", session);
      } else if (event === "PASSWORD_RECOVERY") {
        toast.info("Please check your email for password reset instructions.");
      } else if (event === "USER_DELETED") {
        toast.error("Account deleted.");
        navigate("/login");
      }
    });

    // Check if user is already signed in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/questionnaire");
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
          onError={(error) => {
            console.error('Auth error:', error);
            if (error.message.includes('invalid_credentials')) {
              toast.error('Invalid email or password. Please try again.');
            } else if (error.message.includes('Email not confirmed')) {
              toast.error('Please confirm your email address before signing in.');
            } else {
              toast.error(error.message);
            }
          }}
        />
      </div>
    </div>
  );
};

export default Login;