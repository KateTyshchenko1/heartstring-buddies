import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import Logo from "@/components/shared/Logo";

interface ChatHeaderProps {
  botName: string;
  onLogout: () => void;
}

const ChatHeader = ({ botName, onLogout }: ChatHeaderProps) => {
  return (
    <div className="p-2 bg-white/80 backdrop-blur-sm border-b border-gray-100 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <Link to="/">
          <Logo />
        </Link>
        <span className="text-sm font-display text-primary hidden sm:inline">
          {botName}
        </span>
      </div>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onLogout}
        className="flex items-center gap-1 text-sm"
      >
        <LogOut className="h-3 w-3" />
        <span>Logout</span>
      </Button>
    </div>
  );
};

export default ChatHeader;