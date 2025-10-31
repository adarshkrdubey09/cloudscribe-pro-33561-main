import { useState, useCallback } from "react";
import { NotebookHeader } from "./NotebookHeader";
import { SourcesPanel } from "./SourcesPanel";
import { ChatPanel } from "./ChatPanel";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";

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

  return (
    <div className="h-screen flex flex-col bg-background">
      <NotebookHeader onLogout={onLogout} />
      
      {/* Mobile/Tablet Toggle Button */}
      <div className="lg:hidden flex gap-2 p-4 border-b border-border">
        <Button
          variant={sourcesOpen ? "default" : "secondary"}
          size="sm"
          onClick={() => setSourcesOpen(!sourcesOpen)}
          className="flex-1"
        >
          <Menu className="w-4 h-4 mr-2" />
          Sources
        </Button>
      </div>
      
      <div className="flex-1 flex overflow-hidden relative">
        {/* Sources Panel - Hidden on mobile unless toggled */}
        <div className={`
          lg:block lg:relative lg:w-80
          ${sourcesOpen ? 'block absolute inset-y-0 left-0 z-50 w-80' : 'hidden'}
          md:${sourcesOpen ? 'w-96' : 'w-80'}
        `}>
        <SourcesPanel 
          onClose={() => setSourcesOpen(false)} 
          onFileAdd={handleFileUpload}
          sources={sources}
          onDeleteSource={(id) => setSources(prev => prev.filter(s => s.id !== id))}
        />
        </div>
        
        {/* Chat Panel - Always visible, takes remaining space */}
        <div className="flex-1 min-w-0">
          <ChatPanel onFileUpload={handleFileUpload} />
        </div>
        
        {/* Overlay for mobile panels */}
        {sourcesOpen && (
          <div 
            className="lg:hidden absolute inset-0 bg-black/50 z-40"
            onClick={() => setSourcesOpen(false)}
          />
        )}
      </div>
    </div>
  );
}