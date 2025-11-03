import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, FileText, Upload, Trash2, Eye, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Source {
  id: string;
  name: string;
  type: "pdf" | "text" | "url" | "video" | "audio" | "document";
  size?: string;
  uploadedAt: Date;
}

interface SourcesPanelProps {
  onClose?: () => void;
  onFileAdd?: (file: File) => void;
  sources?: Source[];
  onDeleteSource?: (id: string) => void;
}

export function SourcesPanel({
  onClose,
  onFileAdd,
  sources: externalSources = [],
  onDeleteSource: externalDeleteSource,
}: SourcesPanelProps) {
  const [localSources, setLocalSources] = useState<Source[]>([]);
  const [previewSource, setPreviewSource] = useState<Source | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const sources = externalSources.length > 0 ? externalSources : localSources;

  const getSourceIcon = (type: Source["type"]) => {
    return <FileText className="w-4 h-4 text-red-400" />;
  };

  const handleDeleteSource = (id: string) => {
    if (externalDeleteSource) {
      externalDeleteSource(id);
    } else {
      setLocalSources(localSources.filter((source) => source.id !== id));
    }
    toast({
      title: "Source removed",
      description: "The source has been deleted",
    });
  };

  const processFile = (file: File) => {
    // Only allow PDF files
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      toast({
        title: "Invalid file type",
        description: "Only PDF files are allowed",
        variant: "destructive",
      });
      return;
    }

    // If external sources are managed by parent, only notify parent
    if (externalDeleteSource && onFileAdd) {
      onFileAdd(file);
    } else {
      // Otherwise manage locally
      const newSource: Source = {
        id: Date.now().toString(),
        name: file.name,
        type: "pdf",
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        uploadedAt: new Date(),
      };
      setLocalSources((prev) => [...prev, newSource]);
    }

    toast({
      title: "File uploaded",
      description: `${file.name} has been added to sources`,
    });
  };

  // ✅ Reusable API upload function
  async function uploadFile(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("https://dev.ai.rosmerta.dev/tender/api/pdf/upload-pdf/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

      const data = await response.json();
      console.log("✅ Upload success:", data);

      // Optional toast for UI feedback
      toast({
        title: "File uploaded successfully",
        description: `${file.name} has been uploaded.`,
      });

      return data;
    } catch (error) {
      console.error("❌ Upload failed:", error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your file.",
        variant: "destructive",
      });
    }
  }

  // ✅ Handle file upload (from input)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file); // local state
      uploadFile(file); // server upload
    }
  };

  // ✅ Handle drag over (for highlighting)
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  // ✅ Handle drag leave
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  // ✅ Handle drop (for drag-and-drop uploads)
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      processFile(file); // local display
      uploadFile(file); // send to API
    }
  };

  return (
    <div
      className="w-full h-full border-r border-border bg-card/30 backdrop-blur-sm flex flex-col"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input ref={fileInputRef} type="file" onChange={handleFileUpload} className="hidden" accept=".pdf" />
      <div className="p-3 sm:p-4 md:p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-base sm:text-lg font-semibold">Sources</h2>
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="sm:hidden h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="default" size="sm" className="w-full gap-2 justify-center text-sm">
                <Plus className="w-4 h-4" />
                Add PDF
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuItem className="gap-2" onClick={() => fileInputRef.current?.click()}>
                <Upload className="w-4 h-4" />
                Upload PDF File
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Always visible drag-and-drop area */}
        <div className="p-3 sm:p-4 md:p-4">
          <div
            className={`text-center py-6 sm:py-8 md:py-12 rounded-lg border-2 border-dashed transition-colors cursor-pointer ${
              isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <FileText className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-muted-foreground mx-auto mb-2 sm:mb-3" />
            <p className="text-muted-foreground text-xs sm:text-sm mb-1">
              {isDragging ? "Drop PDF here" : "Drag & drop PDF"}
            </p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              {isDragging ? "Release to upload" : "or click to browse"}
            </p>
          </div>
        </div>

        {/* Scrollable uploaded files section */}
        {sources.length > 0 && (
          <div className="flex-1 overflow-y-auto px-3 sm:px-4 md:px-4 pb-3 sm:pb-4 md:pb-4">
            <div className="mb-2">
              <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">Uploaded Files ({sources.length})</h3>
            </div>
            <div className="space-y-2">
              {sources.map((source) => (
                <Card key={source.id} className="p-2 sm:p-3 surface-elevated hover:surface-interactive transition-colors group">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="mt-0.5">{getSourceIcon(source.type)}</div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-xs sm:text-sm text-foreground truncate">{source.name}</h3>
                      <div className="flex items-center gap-1.5 sm:gap-2 mt-1 flex-wrap">
                        {source.size && <span className="text-[10px] sm:text-xs text-muted-foreground">{source.size}</span>}
                        <span className="text-[10px] sm:text-xs text-muted-foreground">{source.uploadedAt.toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm" className="h-6 w-6 sm:h-6 sm:w-6 p-0" onClick={() => setPreviewSource(source)}>
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 sm:h-6 sm:w-6 p-0 text-destructive hover:text-destructive"
                        onClick={() => handleDeleteSource(source.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      <Dialog open={!!previewSource} onOpenChange={() => setPreviewSource(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {previewSource && getSourceIcon(previewSource.type)}
              {previewSource?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {previewSource && (
              <div className="space-y-4">
                <div className="p-4 rounded-lg surface-elevated">
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p>
                      <strong>Type:</strong> {previewSource.type.toUpperCase()}
                    </p>
                    {previewSource.size && (
                      <p>
                        <strong>Size:</strong> {previewSource.size}
                      </p>
                    )}
                    <p>
                      <strong>Uploaded:</strong> {previewSource.uploadedAt.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="p-4 rounded-lg surface-elevated">
                  <p className="text-sm text-muted-foreground">
                    File preview functionality coming soon. The file has been successfully uploaded and is ready to use.
                  </p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
