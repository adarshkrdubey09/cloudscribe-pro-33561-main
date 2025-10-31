import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Send, Bot, User, Sparkles, Copy, Check } from "lucide-react";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatPanelProps {
  onFileUpload?: (file: File) => void;
}

export function ChatPanel({ onFileUpload }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };
    
    console.log(newMessage)

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content:
          "I'm here to help! I can assist you with analyzing documents, answering questions, or having a general conversation. Upload documents using the Sources panel or just ask me anything!",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopy = async (content: string, id: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      toast({
        title: "Copied to clipboard",
        description: "Message content copied successfully",
      });
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy message to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-background min-w-0 relative h-full overflow-hidden">
      <div className="p-4 md:p-6 border-b border-border flex-shrink-0 surface-elevated">
        <h2 className="text-lg font-semibold">Chat</h2>
      </div>

      <ScrollArea className="flex-1 p-4 md:p-6 pb-40 md:pb-44 overflow-y-auto" ref={scrollAreaRef}>
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center mb-6 shadow-glow animate-scale-in">
              <Sparkles className="w-10 h-10 text-primary-foreground" />
            </div>

            <h3 className="text-2xl font-semibold mb-3">How can I help?</h3>
            <p className="text-muted-foreground mb-8 max-w-md leading-relaxed">
              Need help with brainstorming, writing AI Tender Chat Bot anything!
            </p>
          </div>
        ) : (
          <div className="space-y-6 max-w-4xl mx-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 animate-fade-in ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.type === "assistant" && (
                  <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 shadow-premium">
                    <Bot className="w-5 h-5 text-primary-foreground" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div
                    className={`max-w-[85%] sm:max-w-[70%] p-4 rounded-xl shadow-premium group relative ${
                      message.type === "user" ? "gradient-primary text-primary-foreground ml-auto" : "surface-elevated"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs opacity-70">{message.timestamp.toLocaleTimeString()}</span>
                      {message.type === "assistant" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleCopy(message.content, message.id)}
                        >
                          {copiedId === message.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {message.type === "user" && (
                  <div className="w-10 h-10 rounded-xl surface-elevated flex items-center justify-center flex-shrink-0 shadow-premium">
                    <User className="w-5 h-5" />
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3 justify-start animate-fade-in">
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 shadow-premium">
                  <Bot className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="surface-elevated p-4 rounded-xl shadow-premium">
                  <div className="flex gap-1.5">
                    <div
                      className="w-2 h-2 rounded-full bg-primary animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full bg-primary animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full bg-primary animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>

      <div className="fixed bottom-0 left-0 right-0 lg:left-[320px] p-4 md:p-6 border-t border-border/50 surface-elevated backdrop-blur-md bg-background/98 z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end gap-2 md:gap-3">
            <div className="flex-1 relative">
              <div className="relative rounded-xl transition-all duration-300 ring-1 ring-border/50 shadow-premium hover:ring-border hover:shadow-glow">
                <Textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask me anything"
                  className="min-h-[56px] max-h-[160px] resize-none transition-all duration-300 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-background/80 backdrop-blur-sm"
                  rows={1}
                />
              </div>
            </div>

            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              size="lg"
              className="h-[56px] w-[56px] p-0 rounded-xl gradient-primary shadow-glow hover:shadow-[0_0_50px_hsl(var(--primary)/0.5)] disabled:opacity-40 disabled:shadow-none transition-all duration-300 hover:scale-105 active:scale-95 flex-shrink-0"
              title="Send message"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex items-center justify-center mt-3 text-xs text-muted-foreground/70 px-2">
            <span className="hidden md:inline transition-colors hover:text-muted-foreground">
              <kbd className="px-1.5 py-0.5 rounded bg-muted/50 text-[10px] font-medium">Enter</kbd> to send •
              <kbd className="px-1.5 py-0.5 rounded bg-muted/50 text-[10px] font-medium ml-1">Shift+Enter</kbd> for new
              line
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
