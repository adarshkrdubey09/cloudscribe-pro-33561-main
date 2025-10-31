import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Mic,
  Video,
  Brain,
  FileText,
  Download,
  Play,
  Edit,
  Plus,
  ChevronDown,
  X
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface StudioItem {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  type: 'audio' | 'video' | 'mindmap' | 'report';
  status: 'available' | 'generating' | 'ready';
  languages?: string[];
}

interface StudioPanelProps {
  onClose?: () => void;
}

export function StudioPanel({ onClose }: StudioPanelProps) {
  const studioItems: StudioItem[] = [
    {
      id: '1',
      title: 'Audio Overview',
      description: 'Generate podcast-style audio summaries',
      icon: Mic,
      type: 'audio',
      status: 'available',
      languages: ['English', 'Spanish', 'French', 'German', 'Japanese']
    },
    {
      id: '2',
      title: 'Video Overview',
      description: 'Create visual presentation summaries',
      icon: Video,
      type: 'video',
      status: 'available'
    },
    {
      id: '3',
      title: 'Mind Map',
      description: 'Visual concept mapping and connections',
      icon: Brain,
      type: 'mindmap',
      status: 'available'
    },
    {
      id: '4',
      title: 'Reports',
      description: 'Comprehensive written analysis',
      icon: FileText,
      type: 'report',
      status: 'available'
    }
  ];

  const getStatusColor = (status: StudioItem['status']) => {
    switch (status) {
      case 'available':
        return 'secondary';
      case 'generating':
        return 'outline';
      case 'ready':
        return 'default';
    }
  };

  const getStatusText = (status: StudioItem['status']) => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'generating':
        return 'Generating...';
      case 'ready':
        return 'Ready';
    }
  };

  return (
    <div className="w-full h-full border-l border-border bg-card/30 backdrop-blur-sm flex flex-col">
      <div className="p-3 md:p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Studio</h2>
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="lg:hidden h-6 w-6 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
        
        <div className="space-y-3">
          {studioItems.slice(0, 2).map((item) => (
            <Card key={item.id} className="p-3 md:p-4 surface-elevated hover:surface-interactive transition-all group cursor-pointer">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg gradient-accent flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-accent-foreground" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-sm">{item.title}</h3>
                    <Badge variant={getStatusColor(item.status)} className="text-xs">
                      {getStatusText(item.status)}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
              
              {item.languages && (
                <div className="mb-3">
                  <p className="text-xs text-muted-foreground mb-2">
                    Create an Audio Overview in:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {item.languages.slice(0, 3).map((lang) => (
                      <Badge key={lang} variant="outline" className="text-xs px-2 py-1">
                        {lang}
                      </Badge>
                    ))}
                    {item.languages.length > 3 && (
                      <Badge variant="outline" className="text-xs px-2 py-1">
                        +{item.languages.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}
              
              <div className="flex gap-2">
                <Button size="sm" className="flex-1 gap-1">
                  <Play className="w-3 h-3" />
                  Generate
                </Button>
                <Button variant="ghost" size="sm" className="px-2">
                  <Edit className="w-3 h-3" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-3 md:p-4">
        <div className="space-y-3">
          {studioItems.slice(2).map((item) => (
            <Card key={item.id} className="p-3 md:p-4 surface-elevated hover:surface-interactive transition-all group cursor-pointer">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center">
                  <item.icon className="w-4 h-4 text-accent-foreground" />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-medium text-sm">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </div>
                
                <Badge variant={getStatusColor(item.status)} className="text-xs">
                  {getStatusText(item.status)}
                </Badge>
              </div>
              
              <Button size="sm" variant="secondary" className="w-full gap-1">
                <Plus className="w-3 h-3" />
                Create
              </Button>
            </Card>
          ))}
        </div>

        <div className="mt-6 p-3 md:p-4 surface-elevated rounded-lg border">
          <h3 className="font-medium text-sm mb-2">Studio Output</h3>
          <p className="text-xs text-muted-foreground mb-4">
            Generated content will be saved here. Add sources and create Audio Overview, 
            Study Guide, Timeline, and more!
          </p>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="w-full gap-2">
                <Plus className="w-3 h-3" />
                Add note
                <ChevronDown className="w-3 h-3 ml-auto" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem className="gap-2">
                <FileText className="w-4 h-4" />
                Text Note
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2">
                <Mic className="w-4 h-4" />
                Voice Note
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2">
                <Download className="w-4 h-4" />
                Import File
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}