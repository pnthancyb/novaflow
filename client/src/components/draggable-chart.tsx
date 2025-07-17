import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MermaidChart } from "@/components/mermaid-chart";
import { Move, Maximize2, Minimize2, X } from "lucide-react";

interface DraggableChartProps {
  mermaidCode: string;
  isVisible: boolean;
  onClose: () => void;
  onUpdateChart: (code: string) => void;
}

export function DraggableChart({ mermaidCode, isVisible, onClose, onUpdateChart }: DraggableChartProps) {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [size, setSize] = useState({ width: 800, height: 600 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = isDragging ? 'grabbing' : 'nw-resize';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'default';
    };
  }, [isDragging, isResizing, dragOffset]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setIsDragging(true);
    }
  };

  const handleMaximize = () => {
    if (isMaximized) {
      setSize({ width: 800, height: 600 });
      setPosition({ x: 100, y: 100 });
    } else {
      setSize({ 
        width: window.innerWidth - 40, 
        height: window.innerHeight - 100 
      });
      setPosition({ x: 20, y: 20 });
    }
    setIsMaximized(!isMaximized);
  };

  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <Card
        ref={cardRef}
        className="absolute bg-background border-2 border-border shadow-2xl"
        style={{
          left: position.x,
          top: position.y,
          width: size.width,
          height: size.height,
          minWidth: 400,
          minHeight: 300,
        }}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between p-3 bg-muted border-b border-border cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center space-x-2">
            <Move className="w-4 h-4 text-muted-foreground" />
            <span className="font-semibold text-sm">Chart Preview</span>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleMaximize}
              className="h-8 w-8 p-0"
            >
              {isMaximized ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onClose}
              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-4 h-full overflow-auto">
          <div className="w-full h-full">
            <MermaidChart 
              chart={mermaidCode} 
              className="w-full h-full min-h-[400px]"
            />
          </div>
        </CardContent>

        {/* Resize Handle */}
        <div
          className="absolute bottom-0 right-0 w-4 h-4 bg-muted border-l border-t border-border cursor-nw-resize"
          onMouseDown={(e) => {
            e.preventDefault();
            setIsResizing(true);
          }}
        />
      </Card>
    </div>
  );
}