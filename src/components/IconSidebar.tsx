import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface IconSidebarProps {
  onHover: () => void;
  onFileClick: () => void;
}

export function IconSidebar({ onHover, onFileClick }: IconSidebarProps) {
  return (
    <div 
      className="fixed left-0 top-14 md:top-16 bottom-0 w-16 md:w-20 bg-card/50 backdrop-blur-sm border-r border-border flex items-center justify-center z-20 transition-all duration-300"
      onMouseEnter={onHover}
    >
      <button
        onClick={onFileClick}
        className="flex flex-col items-center justify-center gap-2 md:gap-2.5 p-2 rounded-xl hover:bg-accent/50 transition-all duration-200 group"
      >
        <div className="h-11 w-11 md:h-12 md:w-12 rounded-full bg-accent/30 flex items-center justify-center group-hover:bg-accent/50 group-hover:scale-105 transition-all duration-200 shadow-sm">
          <Upload className="w-5 h-5 md:w-6 md:h-6 text-primary" />
        </div>
        <span className="text-[10px] md:text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors whitespace-nowrap">
          Add File
        </span>
      </button>
    </div>
  );
}
