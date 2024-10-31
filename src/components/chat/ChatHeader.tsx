import { Link } from "react-router-dom";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/shared/Logo";

interface ChatHeaderProps {
  botName: string;
  onLogout: () => void;
}

const ChatHeader = ({ botName, onLogout }: ChatHeaderProps) => {
  return (
    <div className="sticky top-0 z-10 p-3 sm:p-4 bg-white/80 backdrop-blur-sm border-b border-gray-100 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Link to="/">
          <Logo />
        </Link>
        <span className="text-base sm:text-lg font-display text-primary hidden sm:inline">
          {botName}
        </span>
      </div>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onLogout}
        className="flex items-center gap-2"
      >
        <LogOut className="h-4 w-4" />
        <span>Logout</span>
      </Button>
    </div>
  );
};

export default ChatHeader;