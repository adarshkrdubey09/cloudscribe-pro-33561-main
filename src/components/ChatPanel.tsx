import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Send, Bot, User, Sparkles, Copy, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatPanelProps {
  onFileUpload?: (file: File) => void;
  sourcesOpen?: boolean;
}

export function ChatPanel({ onFileUpload, sourcesOpen = true }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Function to automatically convert URLs in plain text into markdown links
  // Function to automatically convert URLs in plain text into markdown links
  const autoLinkify = (text: string) => {
    // 1️⃣ Remove backticks around URLs safely
    const cleaned = text.replace(/`(https?:\/\/[^\s`]+)`/g, "$1");

    // 2️⃣ Replace plain URLs not already in [text](url) form
    return cleaned.replace(/(?<!\]\()https?:\/\/[^\s)]+/g, (url) => `[${url}](${url})`);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      const response = await fetch("https://dev.ai.rosmerta.dev/tender/api/rag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: inputValue }),
      });

      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      const data = await response.json();

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: data?.result?.answer || "No response received.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("❌ Fetch failed:", error);
      toast({
        title: "Error",
        description: "Failed to fetch AI response",
        variant: "destructive",
      });
    } finally {
      setIsTyping(false);
    }
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
    <div className="flex-1 flex flex-col bg-background min-w-0 relative overflow-hidden" style={{ height: "100%" }}>
      <div className="p-3 sm:p-4 md:p-6 border-b border-border flex-shrink-0 surface-elevated">
        <h2 className="text-base sm:text-lg font-semibold">Chat</h2>
      </div>

      <ScrollArea className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 pb-36 sm:pb-40 md:pb-36 lg:pb-40 overflow-y-auto" ref={scrollAreaRef}>
        <div className="max-w-3xl lg:max-w-4xl mx-auto w-full h-full">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl gradient-primary flex items-center justify-center mb-4 sm:mb-6 shadow-glow animate-scale-in">
                <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-primary-foreground" />
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3">How can I help?</h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-8 max-w-md leading-relaxed">
                Need help with brainstorming, writing AI Tender Chat Bot anything!
              </p>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-2 sm:gap-3 animate-fade-in ${
                    message.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.type === "assistant" && (
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 shadow-premium">
                      <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
                    </div>
                  )}

                  <div
                    className={`p-3 sm:p-4 rounded-xl shadow-premium group relative max-w-[85%] sm:max-w-[75%] md:max-w-[65%] ${
                      message.type === "user" ? "gradient-primary text-primary-foreground" : "surface-elevated"
                    }`}
                  >
                    {/* ✅ Markdown Renderer */}
                    <div className="prose prose-sm max-w-none text-xs sm:text-sm leading-relaxed prose-p:mb-2 prose-li:my-0 prose-strong:font-semibold prose-headings:font-semibold break-words">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[]}
                        components={{
                          a: ({ href, children }) => (
                            <a
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline hover:text-blue-800"
                            >
                              {children}
                            </a>
                          ),
                        }}
                      >
                        {autoLinkify(message.content)}
                      </ReactMarkdown>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px] sm:text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                      {message.type === "assistant" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 w-5 sm:h-6 sm:w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleCopy(message.content, message.id)}
                        >
                          {copiedId === message.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        </Button>
                      )}
                    </div>
                  </div>

                  {message.type === "user" && (
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl surface-elevated flex items-center justify-center flex-shrink-0 shadow-premium">
                      <User className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-2 sm:gap-3 justify-start animate-fade-in">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 shadow-premium">
                    <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
                  </div>
                  <div className="surface-elevated p-3 sm:p-4 rounded-xl shadow-premium">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                      <div
                        className="w-2 h-2 rounded-full bg-primary animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      />
                      <div
                        className="w-2 h-2 rounded-full bg-primary animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Bar - Fixed at bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-4 lg:p-5 border-t border-border/50 surface-elevated backdrop-blur-md bg-background/95 z-10 safe-bottom">
        <div className="max-w-3xl lg:max-w-4xl mx-auto">
          <div className="flex items-end gap-2 md:gap-3">
            <div className="flex-1 relative min-w-0">
              <div className="relative rounded-xl transition-all duration-300 ring-1 ring-border/50 shadow-premium hover:ring-border hover:shadow-glow">
                <Textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask me anything"
                  className="min-h-[48px] sm:min-h-[56px] max-h-[120px] sm:max-h-[160px] resize-none transition-all duration-300 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-background/80 backdrop-blur-sm text-sm sm:text-base pr-3"
                  rows={1}
                />
              </div>
            </div>

            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              size="lg"
              className="h-[48px] w-[48px] sm:h-[56px] sm:w-[56px] p-0 rounded-xl gradient-primary shadow-glow hover:shadow-[0_0_50px_hsl(var(--primary)/0.5)] disabled:opacity-40 disabled:shadow-none transition-all duration-300 hover:scale-105 active:scale-95 flex-shrink-0"
              title="Send message"
            >
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>

          {/* <div className="flex items-center justify-center mt-2 sm:mt-3 text-xs text-muted-foreground/70 px-2">
            <span className="hidden md:inline transition-colors hover:text-muted-foreground">
              <kbd className="px-1.5 py-0.5 rounded bg-muted/50 text-[10px] font-medium">Enter</kbd> to send •
              <kbd className="px-1.5 py-0.5 rounded bg-muted/50 text-[10px] font-medium ml-1">Shift+Enter</kbd> for new
              line
            </span>
          </div> */}
        </div>
      </div>
    </div>
  );
}
