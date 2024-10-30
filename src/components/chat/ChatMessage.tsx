import { format } from "date-fns";

interface ChatMessageProps {
  message: string;
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

const ChatMessage = ({ 
  message, 
  isUser, 
  timestamp,
  emotionalContext,
  conversationStyle 
}: ChatMessageProps) => {
  const getMessageStyle = () => {
    if (!conversationStyle) return "";
    
    const styles: Record<string, string> = {
      flirty: "italic",
      witty: "font-medium",
      playful: "text-primary/90",
      charming: "text-secondary/90",
      mysterious: "text-gray-600",
      intellectual: "font-serif",
      supportive: "text-emerald-600"
    };
    
    return styles[conversationStyle] || "";
  };

  return (
    <div className={`flex flex-col ${isUser ? "items-end" : "items-start"} mb-4`}>
      <div 
        className={`max-w-[80%] px-4 py-2 rounded-lg ${
          isUser 
            ? "bg-primary/10 text-primary" 
            : "bg-gray-50 text-gray-800"
        } ${getMessageStyle()}`}
      >
        {message}
      </div>
      <span className="text-xs text-gray-400 mt-1 px-1">
        {format(timestamp, "h:mm a")}
      </span>
    </div>
  );
};

export default ChatMessage;