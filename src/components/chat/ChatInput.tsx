import { useState } from "react";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

const ChatInput = ({ onSendMessage }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 px-4 py-2 rounded-full border border-gray-200
                   focus:ring-2 focus:ring-primary focus:border-transparent"
      />
      <button
        type="submit"
        className="p-2 rounded-full bg-primary hover:bg-primary-dark
                   text-white transition-colors duration-200 disabled:opacity-50"
        disabled={!message.trim()}
      >
        <Send className="w-5 h-5" />
      </button>
    </form>
  );
};

export default ChatInput;