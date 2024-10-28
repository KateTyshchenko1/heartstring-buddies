import { format } from "date-fns";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatMessage = ({ message, isUser, timestamp }: ChatMessageProps) => {
  const userContext = JSON.parse(localStorage.getItem('userContext') || '{}');
  const userName = userContext.name || 'You';
  const botName = userContext.soulmate_name || 'AI';

  return (
    <div className={`flex flex-col ${isUser ? "items-end" : "items-start"} mb-4`}>
      <span className="text-xs font-medium text-secondary-foreground mb-1 px-1">
        {isUser ? userName : botName}
      </span>
      <div 
        className={`max-w-[80%] px-4 py-2 rounded-2xl ${
          isUser 
            ? "bg-primary text-white" 
            : "bg-gray-100 text-secondary-foreground"
        }`}
      >
        {message}
      </div>
      <span className="text-xs text-gray-500 mt-1 px-1">
        {format(timestamp, "h:mm a")}
      </span>
    </div>
  );
};

export default ChatMessage;