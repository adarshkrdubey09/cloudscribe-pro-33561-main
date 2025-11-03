import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Share2, 
  Settings, 
  Grid3X3, 
  User,
  Edit3,
  Check,
  Menu
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NotebookHeaderProps {
  onLogout: () => void;
  onToggleSources: () => void;
}

export function NotebookHeader({ onLogout, onToggleSources }: NotebookHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [notebookName, setNotebookName] = useState("AI CHAT BOT TENDER");

  const handleNameEdit = () => {
    if (isEditing) {
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  return (
    <header className="h-14 md:h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-1">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onToggleSources}
          className="flex-shrink-0"
        >
          <Menu className="w-4 h-4" />
        </Button>
        
        <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
          <Grid3X3 className="w-3 h-3 md:w-4 md:h-4 text-primary-foreground" />
        </div>
        
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <Input
                value={notebookName}
                onChange={(e) => setNotebookName(e.target.value)}
                className="text-sm md:text-lg font-semibold border-none bg-transparent p-0 h-auto focus-visible:ring-0 min-w-0"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setIsEditing(false);
                  }
                }}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNameEdit}
                className="h-6 w-6 p-0"
              >
                <Check className="w-3 h-3" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 min-w-0">
              <h1 className="text-sm md:text-lg font-semibold text-foreground truncate">
                {notebookName}
              </h1>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNameEdit}
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Edit3 className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
        <Button variant="secondary" size="sm" className="gap-2 hidden sm:flex">
          <Share2 className="w-4 h-4" />
          <span className="hidden md:inline">Share</span>
        </Button>
        <Button variant="secondary" size="sm" className="sm:hidden">
          <Share2 className="w-4 h-4" />
        </Button>
        
        <Button variant="ghost" size="sm">
          <Settings className="w-4 h-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="w-8 h-8 rounded-full p-0">
              <User className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Account Settings</DropdownMenuItem>
            <DropdownMenuItem onClick={onLogout}>Sign Out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}