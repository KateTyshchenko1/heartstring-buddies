import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChatMessage from "@/components/chat/ChatMessage";
import ChatInput from "@/components/chat/ChatInput";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatContainer from "@/components/chat/ChatContainer";
import { handleChatInteraction } from "@/services/chat";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { xaiService } from "@/services/xai";
import type { Message, ConversationData, EmotionalContext } from "@/types/chat";

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [botName, setBotName] = useState("");
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const initializeChat = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('No user found');

        // Fetch companion profile and questionnaire data
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

        // Load existing messages
        if (conversationsResponse.data?.length > 0) {
          const mappedMessages = conversationsResponse.data.map((msg: ConversationData) => {
            // Convert the JSON emotional_context to EmotionalContext type
            const emotionalContext = msg.emotional_context as unknown as EmotionalContext;
            
            return {
              id: msg.id,
              text: msg.message,
              isUser: msg.is_user,
              timestamp: new Date(msg.timestamp || Date.now()),
              emotionalContext,
              conversationStyle: msg.conversation_style
            };
          });
          setMessages(mappedMessages);
        } else {
          // Generate initial greeting
          const greeting = await xaiService.generateGreeting(user.id, questionnairResponse.data.name);
          const newMessage: Message = {
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

      // Save user message
      await supabase
        .from('conversations')
        .insert({
          profile_id: user.id,
          message: text,
          is_user: true,
          emotional_context: userMessage.emotionalContext,
          conversation_style: userMessage.conversationStyle
        });

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
        conversationStyle: metrics.connectionStyle
      };

      // Save AI response
      await supabase
        .from('conversations')
        .insert({
          profile_id: user.id,
          message: response,
          is_user: false,
          emotional_context: aiMessage.emotionalContext,
          conversation_style: aiMessage.conversationStyle
        });

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
    <div className="min-h-screen bg-gradient-to-br from-cream via-primary/5 to-secondary/5">
      <div className="mx-auto max-w-3xl h-screen flex flex-col">
        <ChatHeader botName={botName} onLogout={handleLogout} />
        <ChatContainer messages={messages} isLoading={isLoading} />
        <div className="p-4 bg-white/80 backdrop-blur-sm border-t border-gray-100 sticky bottom-0">
          <ChatInput onSendMessage={handleSendMessage} />
        </div>
      </div>
    </div>
  );
};

export default Chat;