import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChatMessage from "@/components/chat/ChatMessage";
import ChatInput from "@/components/chat/ChatInput";
import Logo from "@/components/shared/Logo";
import { generateResponse } from "@/services/xai";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { selectGreeting } from "@/utils/greetingSystem";
import type { BotPersonality, UserContext } from "@/types/greeting";

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Successfully logged out!");
    navigate("/login");
  };

  useEffect(() => {
    const userContext = JSON.parse(localStorage.getItem('userContext') || '{}');
    const soulmateNameFromStorage = userContext.soulmate_name || 'AI Companion';
    setBotName(soulmateNameFromStorage);

    const botPersonality: BotPersonality = {
      style: "nurturing",
      profession: userContext.soulmate_backstory?.occupation || "companion",
      interests: (userContext.soulmate_backstory?.interests || "").split(',').map((i: string) => i.trim()),
      traits: [(userContext.soulmate_backstory?.personality || "").split('.')[0]],
    };

    const userCtx: UserContext = {
      name: userContext.name || "friend",
      seekingFor: "companionship",
      interests: Object.values(userContext.questionnaire_responses || {})
        .filter((response: any) => typeof response === 'string')
        .map((response: string) => response.split(' ').slice(0, 3).join(' ')),
      keyGoal: userContext.questionnaire_responses?.learning_desires,
      emotionalState: userContext.questionnaire_responses?.unwind_method,
    };

    const greeting = selectGreeting(soulmateNameFromStorage, userCtx, botPersonality);

    setMessages([{
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
      conversationStyle: 'playful'
    }]);
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

      // Save user message to conversations
      const { error: userMsgError } = await supabase
        .from('conversations')
        .insert({
          profile_id: user.id,
          message: text,
          is_user: true,
          emotional_context: userMessage.emotionalContext,
          conversation_style: userMessage.conversationStyle
        });

      if (userMsgError) throw userMsgError;

      const response = await generateResponse(text);
      
      // Save AI response to conversations
      const { error: aiMsgError } = await supabase
        .from('conversations')
        .insert({
          profile_id: user.id,
          message: response,
          is_user: false,
          emotional_context: {
            conversationVibe: 'light',
            energyLevel: 'upbeat',
            flirtFactor: 1,
            wittyExchanges: true,
            followUpNeeded: false
          },
          conversation_style: 'playful'
        });

      if (aiMsgError) throw aiMsgError;
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date(),
        emotionalContext: {
          conversationVibe: 'light',
          energyLevel: 'upbeat',
          flirtFactor: 1,
          wittyExchanges: true,
          followUpNeeded: false
        },
        conversationStyle: 'playful'
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error: any) {
      toast.error(error.message || "Failed to save conversation");
    } finally {
      setIsLoading(false);
    }
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