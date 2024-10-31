import { Message } from "@/types/chat";
import ChatMessage from "./ChatMessage";

interface ChatContainerProps {
  messages: Message[];
  isLoading: boolean;
}

const ChatContainer = ({ messages, isLoading }: ChatContainerProps) => {
  return (
    <div className="flex-1 overflow-y-auto p-2 space-y-3">
      {messages.map((message) => (
        <ChatMessage
          key={message.id}
          message={message.text}
          isUser={message.isUser}
          timestamp={message.timestamp}
          emotionalContext={message.emotionalContext}
          conversationStyle={message.conversationStyle}
        />
      ))}
      {isLoading && (
        <div className="flex items-center space-x-1 p-2">
          <div className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce" />
          <div className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce delay-100" />
          <div className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce delay-200" />
        </div>
      )}
    </div>
  );
};

export default ChatContainer;