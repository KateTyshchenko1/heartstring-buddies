import { format } from "date-fns";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatMessage = ({ message, isUser, timestamp }: ChatMessageProps) => {
  return (
    <div className={`flex flex-col ${isUser ? "items-end" : "items-start"} mb-4`}>
      <div 
        className={`max-w-[80%] px-4 py-2 rounded-lg ${
          isUser 
            ? "bg-primary text-white" 
            : "bg-white text-gray-800 shadow-sm"
        }`}
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