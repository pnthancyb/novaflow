import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MermaidChart } from "@/components/mermaid-chart";
import { Move, Maximize2, Minimize2, X, Download, Code, Fullscreen } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

interface DraggableChartProps {
  mermaidCode: string;
  isVisible: boolean;
  onClose: () => void;
  onUpdateChart: (code: string) => void;
  onEditCode?: () => void;
}

export function DraggableChart({ mermaidCode, isVisible, onClose, onUpdateChart, onEditCode }: DraggableChartProps) {
  const { t } = useTranslation();
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [size, setSize] = useState({ width: 900, height: 700 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = Math.max(0, Math.min(window.innerWidth - size.width, e.clientX - dragOffset.x));
        const newY = Math.max(0, Math.min(window.innerHeight - size.height, e.clientY - dragOffset.y));
        setPosition({ x: newX, y: newY });
      } else if (isResizing) {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;
        const newWidth = Math.max(400, Math.min(window.innerWidth - position.x, resizeStart.width + deltaX));
        const newHeight = Math.max(300, Math.min(window.innerHeight - position.y, resizeStart.height + deltaY));
        setSize({ width: newWidth, height: newHeight });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      document.body.style.cursor = 'default';
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVisible) {
        onClose();
      }
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = isDragging ? 'grabbing' : 'nw-resize';
    }

    if (isVisible) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.cursor = 'default';
    };
  }, [isDragging, isResizing, dragOffset, resizeStart, position, size, isVisible, onClose]);

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

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
    });
    setIsResizing(true);
  };

  const handleMaximize = () => {
    if (isMaximized) {
      setSize({ width: 900, height: 700 });
      setPosition({ x: 100, y: 100 });
    } else {
      setSize({ 
        width: window.innerWidth - 40, 
        height: window.innerHeight - 80 
      });
      setPosition({ x: 20, y: 40 });
    }
    setIsMaximized(!isMaximized);
  };

  const handleFullscreen = () => {
    setSize({ 
      width: window.innerWidth, 
      height: window.innerHeight 
    });
    setPosition({ x: 0, y: 0 });
  };

  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm transition-all duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <Card
        ref={cardRef}
        className="absolute bg-background border-2 border-border shadow-2xl rounded-lg overflow-hidden"
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
          className="flex items-center justify-between p-3 bg-muted/50 border-b border-border cursor-grab active:cursor-grabbing backdrop-blur-sm"
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center space-x-2">
            <Move className="w-4 h-4 text-muted-foreground" />
            <span className="font-semibold text-sm">{t('chart.preview')}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleFullscreen}
              className="h-8 w-8 p-0"
              title={t('chart.fullscreen')}
            >
              <Fullscreen className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleMaximize}
              className="h-8 w-8 p-0"
              title={isMaximized ? t('chart.minimize') : t('chart.maximize')}
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
              title={t('common.close')}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 relative" style={{ height: size.height - 60 }}>
          <MermaidChart 
            chart={mermaidCode} 
            className="w-full h-full"
            showControls={true}
            onEditCode={onEditCode}
          />
        </div>

        {/* Resize Handles */}
        <div
          className="absolute bottom-0 right-0 w-6 h-6 cursor-nw-resize"
          onMouseDown={handleResizeStart}
        >
          <div className="absolute bottom-1 right-1 w-4 h-4 border-r-2 border-b-2 border-muted-foreground/40" />
        </div>
        <div
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-2 cursor-ns-resize"
          onMouseDown={handleResizeStart}
        />
        <div
          className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-8 cursor-ew-resize"
          onMouseDown={handleResizeStart}
        />
      </Card>
    </div>
  );
}