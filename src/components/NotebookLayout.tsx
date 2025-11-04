import { useState, useCallback, useRef } from "react";
import { NotebookHeader } from "./NotebookHeader";
import { SourcesPanel } from "./SourcesPanel";
import { ChatPanel } from "./ChatPanel";
import { IconSidebar } from "./IconSidebar";

interface Source {
  id: string;
  name: string;
  type: 'pdf' | 'text' | 'url' | 'video' | 'audio' | 'document';
  size?: string;
  uploadedAt: Date;
}

interface NotebookLayoutProps {
  onLogout: () => void;
}

export function NotebookLayout({ onLogout }: NotebookLayoutProps) {
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [sources, setSources] = useState<Source[]>([]);
  const [isHovering, setIsHovering] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleFileUpload = useCallback((file: File) => {
    const newSource: Source = {
      id: Date.now().toString(),
      name: file.name,
      type: file.name.endsWith('.pdf') ? 'pdf' : 'document',
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      uploadedAt: new Date()
    };
    setSources(prev => [...prev, newSource]);
  }, []);

  const handleIconHover = useCallback(() => {
    if (!sourcesOpen) {
      setIsHovering(true);
      setSourcesOpen(true);
    }
  }, [sourcesOpen]);

  const handleSourcesMouseLeave = useCallback(() => {
    if (isHovering) {
      hoverTimeoutRef.current = setTimeout(() => {
        setSourcesOpen(false);
        setIsHovering(false);
      }, 300);
    }
  }, [isHovering]);

  const handleSourcesMouseEnter = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  }, []);

  const handleToggleSources = useCallback(() => {
    setSourcesOpen(prev => !prev);
    setIsHovering(false);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <NotebookHeader onLogout={onLogout} onToggleSources={handleToggleSources} />
      
      <div className="flex-1 flex overflow-hidden relative">
        {/* Icon Sidebar - Shows when sources panel is closed on desktop */}
        {!sourcesOpen && (
          <div className="hidden sm:block">
            <IconSidebar 
              onHover={handleIconHover}
              onFileClick={() => setSourcesOpen(true)}
            />
          </div>
        )}

        {/* Sources Panel - Overlay on mobile, side panel on desktop */}
        <div 
          className={`
            transition-all duration-300 ease-in-out
            ${sourcesOpen 
              ? 'w-full sm:w-80 md:w-96 lg:w-[400px]' 
              : 'w-0'
            }
            ${sourcesOpen ? 'fixed sm:relative' : 'relative'}
            ${sourcesOpen ? 'left-0 top-14 md:top-16 lg:top-12 bottom-0' : ''}
            ${sourcesOpen ? 'z-40 sm:z-30' : 'z-30'}
            flex-shrink-0 border-r border-border overflow-hidden bg-background sm:bg-transparent
          `}
          onMouseEnter={handleSourcesMouseEnter}
          onMouseLeave={handleSourcesMouseLeave}
        >
          <SourcesPanel 
            onClose={() => setSourcesOpen(false)} 
            onFileAdd={handleFileUpload}
            sources={sources}
            onDeleteSource={(id) => setSources(prev => prev.filter(s => s.id !== id))}
          />
        </div>

        {/* Backdrop for mobile when sources panel is open */}
        {sourcesOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 sm:hidden"
            onClick={() => setSourcesOpen(false)}
          />
        )}
        
        {/* Chat Panel - Always visible, takes remaining space */}
        <div className={`
          flex-1 min-w-0 transition-all duration-300
          ${!sourcesOpen ? 'ml-0 sm:ml-14 md:ml-16' : 'ml-0'}
        `}>
          <ChatPanel onFileUpload={handleFileUpload} sourcesOpen={sourcesOpen} />
        </div>
      </div>
    </div>
  );
}