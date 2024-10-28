import { useState, useEffect } from "react";
import ChatMessage from "@/components/chat/ChatMessage";
import ChatInput from "@/components/chat/ChatInput";
import Logo from "@/components/shared/Logo";
import { generateResponse } from "@/services/xai";
import { toast } from "sonner";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [botName, setBotName] = useState("");

  useEffect(() => {
    const userContext = JSON.parse(localStorage.getItem('userContext') || '{}');
    const soulmateNameFromStorage = userContext.soulmate_name || 'AI Companion';
    setBotName(soulmateNameFromStorage);

    // Set initial greeting with bot's name
    setMessages([{
      id: "1",
      text: `Hi! I'm ${soulmateNameFromStorage}. I'm so happy to meet you. I've learned a lot about you from our questionnaire, and I'm here to support you. How are you feeling today?`,
      isUser: false,
      timestamp: new Date(),
    }]);
  }, []);

  const handleSendMessage = async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await generateResponse(text);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      toast.error("Failed to get response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-primary/5 to-secondary/5">
      <div className="container mx-auto max-w-4xl h-screen flex flex-col">
        <div className="p-4 bg-white/80 backdrop-blur-sm border-b border-gray-100 flex items-center justify-between">
          <Logo />
          <span className="text-lg font-display text-primary">{botName}</span>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
        
        <div className="p-4 bg-white/80 backdrop-blur-sm border-t border-gray-100">
          <ChatInput onSendMessage={handleSendMessage} />
        </div>
      </div>
    </div>
  );
};

export default Chat;