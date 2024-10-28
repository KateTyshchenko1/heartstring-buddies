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
        className={`max-w-[80%] px-4 py-2 rounded-2xl ${
          isUser 
            ? "bg-primary text-white" 
            : "bg-secondary text-white"
        }`}
      >
        {message}
      </div>
      <span className="text-xs text-gray-500 mt-1">
        {format(timestamp, "h:mm a")}
      </span>
    </div>
  );
};

export default ChatMessage;