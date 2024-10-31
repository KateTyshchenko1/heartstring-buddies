import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChatInput from "@/components/chat/ChatInput";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatMessages from "@/components/chat/ChatMessages";
import { handleChatInteraction } from "@/services/chat";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { xaiService } from "@/services/xai";
import type { Message } from "@/types/chat";

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [botName, setBotName] = useState("");
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    initializeChat();
  }, []);

  const initializeChat = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const [companionResponse, questionnairResponse, conversationsResponse] = await Promise.all([
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
      if (questionnairResponse.error) throw questionnairResponse.error;

      setBotName(questionnairResponse.data.bot_name || "");
      setUserName(questionnairResponse.data.name || "");

      if (conversationsResponse.data?.length > 0) {
        const mappedMessages = conversationsResponse.data.map((msg) => ({
          id: msg.id,
          text: msg.message,
          isUser: msg.is_user,
          timestamp: new Date(msg.timestamp || Date.now()),
          emotionalContext: msg.emotional_context,
          conversationStyle: msg.conversation_style
        }));
        setMessages(mappedMessages);
      } else {
        const greeting = await xaiService.generateGreeting(user.id, questionnairResponse.data.name);
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

  const handleSendMessage = async (text: string) => {
    const userMessage = {
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
      conversationStyle: 'playful' as const
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { response, metrics } = await handleChatInteraction(text, user.id);
      const aiMessage = {
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
        conversationStyle: metrics.connectionStyle
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error: any) {
      toast.error(error.message || "Failed to send message");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Successfully logged out!");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-primary/5 to-secondary/5 flex flex-col">
      <div className="container mx-auto max-w-4xl flex-1 flex flex-col">
        <ChatHeader botName={botName} onLogout={handleLogout} />
        <ChatMessages messages={messages} isLoading={isLoading} />
        <div className="sticky bottom-0 p-3 sm:p-4 bg-white/80 backdrop-blur-sm border-t border-gray-100">
          <div className="max-w-4xl mx-auto w-full px-2">
            <ChatInput onSendMessage={handleSendMessage} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;