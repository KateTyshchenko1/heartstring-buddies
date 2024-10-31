import ChatMessage from "./ChatMessage";
import type { Message } from "@/types/chat";

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

const ChatMessages = ({ messages, isLoading }: ChatMessagesProps) => {
  return (
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
  );
};

export default ChatMessages;