import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { MermaidChart } from "@/components/mermaid-chart";

interface CodeEditorModalProps {
  code: string;
  onSave: (code: string) => void;
  onClose: () => void;
}

export function CodeEditorModal({ code, onSave, onClose }: CodeEditorModalProps) {
  const [currentCode, setCurrentCode] = useState(code);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setCurrentCode(code);
  }, [code]);

  const handleSave = () => {
    onSave(currentCode);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      const newValue = currentCode.substring(0, start) + '  ' + currentCode.substring(end);
      setCurrentCode(newValue);

      // Set cursor position
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Mermaid.js Code Editor</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="flex-1 flex min-h-[500px]">
          {/* Code Editor */}
          <div className="w-1/2 border-r border-border flex flex-col">
            <div className="p-2 bg-muted text-xs font-medium border-b border-border">
              Mermaid Code
            </div>
            <textarea
              ref={textareaRef}
              className="flex-1 p-4 font-mono text-sm border-none outline-none resize-none bg-background text-foreground"
              value={currentCode}
              onChange={(e) => setCurrentCode(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter your Mermaid.js code here..."
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            />
          </div>
          
          {/* Live Preview */}
          <div className="w-1/2 flex flex-col">
            <div className="p-2 bg-muted text-xs font-medium border-b border-border">
              Live Preview
            </div>
            <div className="flex-1 p-4 overflow-auto custom-scrollbar bg-background">
              {currentCode.trim() ? (
                <MermaidChart chart={currentCode} />
              ) : (
                <div className="w-full h-full flex items-center justify-center border border-border rounded">
                  <div className="text-center">
                    <p className="text-muted-foreground text-sm">Live preview will update here</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 pt-4 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Update Chart
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
