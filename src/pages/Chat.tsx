import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChatMessage from "@/components/chat/ChatMessage";
import ChatInput from "@/components/chat/ChatInput";
import Logo from "@/components/shared/Logo";
import { handleChatInteraction } from "@/services/chat";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { xaiService } from "@/services/xai";
import type { BotPersonality, UserContext } from "@/types/greeting";
import type { InteractionMetrics } from "@/types/metrics";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  emotionalContext?: {
    userMood?: string | null;
    conversationVibe: string;
    energyLevel: string;
    flirtFactor: number;
    wittyExchanges: boolean;
    followUpNeeded: boolean;
  };
  conversationStyle?: 'flirty' | 'witty' | 'playful' | 'charming' | 'mysterious' | 'intellectual' | 'supportive';
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [botName, setBotName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const initializeChat = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('No user found');

        // Fetch companion profile and questionnaire data
        const [companionResponse, questionnaireResponse, conversationsResponse] = await Promise.all([
          supabase
            .from('companion_profiles')
            .select('*')
            .eq('profile_id', user.id)
            .single(),
          supabase
            .from('questionnaire_responses')
            .select('*')
            .eq('profile_id', user.id)
            .single(),
          supabase
            .from('conversations')
            .select('*')
            .eq('profile_id', user.id)
            .order('timestamp', { ascending: true })
        ]);

        if (companionResponse.error) throw companionResponse.error;
        if (questionnaireResponse.error) throw questionnaireResponse.error;
        if (conversationsResponse.error) throw conversationsResponse.error;

        // Set bot name
        setBotName(companionResponse.data.name);

        // Load existing messages
        if (conversationsResponse.data.length > 0) {
          setMessages(conversationsResponse.data.map((msg: any) => ({
            id: msg.id,
            text: msg.message,
            isUser: msg.is_user,
            timestamp: new Date(msg.timestamp),
            emotionalContext: msg.emotional_context,
            conversationStyle: msg.conversation_style
          })));
        } else {
          // Generate initial greeting if no messages exist
          const greeting = await xaiService.generateGreeting(user.id);
          const newMessage = {
            id: "1",
            text: greeting,
            isUser: false,
            timestamp: new Date(),
            emotionalContext: {
              conversationVibe: 'light',
              energyLevel: 'upbeat',
              flirtFactor: 0,
              wittyExchanges: false,
              followUpNeeded: false
            },
            conversationStyle: 'playful' as const
          };

          setMessages([newMessage]);

          // Save greeting to conversations
          await supabase
            .from('conversations')
            .insert({
              profile_id: user.id,
              message: greeting,
              is_user: false,
              emotional_context: newMessage.emotionalContext,
              conversation_style: newMessage.conversationStyle
            });
        }
      } catch (error) {
        console.error('Failed to initialize chat:', error);
        toast.error('Failed to load chat history');
      }
    };

    initializeChat();
  }, []);

  const handleSendMessage = async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date(),
      emotionalContext: {
        conversationVibe: 'light',
        energyLevel: 'upbeat',
        flirtFactor: 0,
        wittyExchanges: false,
        followUpNeeded: false
      },
      conversationStyle: 'playful'
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { response, metrics } = await handleChatInteraction(text, user.id);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date(),
        emotionalContext: {
          conversationVibe: metrics.energyLevel,
          energyLevel: metrics.energyLevel,
          flirtFactor: metrics.flirtLevel,
          wittyExchanges: metrics.wittyExchanges > 0,
          followUpNeeded: false
        },
        conversationStyle: metrics.connectionStyle as Message['conversationStyle']
      };

      setMessages((prev) => [...prev, aiMessage]);
      updateChatUI(metrics);
    } catch (error: any) {
      toast.error(error.message || "Failed to save conversation");
    } finally {
      setIsLoading(false);
    }
  };

  const updateChatUI = (metrics: InteractionMetrics) => {
    // Add subtle UI updates based on metrics
    if (metrics.flirtLevel > 7) {
      document.body.classList.add('high-chemistry');
    } else {
      document.body.classList.remove('high-chemistry');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Successfully logged out!");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-primary/5 to-secondary/5">
      <div className="container mx-auto max-w-4xl h-screen flex flex-col px-4 sm:px-6">
        <div className="p-3 sm:p-4 bg-white/80 backdrop-blur-sm border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo />
            <span className="text-base sm:text-lg font-display text-primary hidden sm:inline">{botName}</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message.text}
              isUser={message.isUser}
              timestamp={message.timestamp}
            />
          ))}
          {isLoading && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce delay-100" />
              <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce delay-200" />
            </div>
          )}
        </div>
        
        <div className="p-3 sm:p-4 bg-white/80 backdrop-blur-sm border-t border-gray-100">
          <ChatInput onSendMessage={handleSendMessage} />
        </div>
      </div>
    </div>
  );
};

export default Chat;