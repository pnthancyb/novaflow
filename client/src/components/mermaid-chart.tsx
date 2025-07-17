import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Code, Maximize2, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MermaidChartProps {
  chart: string;
  className?: string;
  onExportPNG?: () => void;
  onEditCode?: () => void;
  showControls?: boolean;
}

export function MermaidChart({ 
  chart, 
  className = "", 
  onExportPNG, 
  onEditCode, 
  showControls = false 
}: MermaidChartProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartElement, setChartElement] = useState<HTMLElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!chart) {
      setIsLoading(false);
      return;
    }

    const renderChart = async () => {
      if (!elementRef.current) return;

      try {
        setIsLoading(true);
        setError(null);

        // Configure mermaid with high-quality settings
        mermaid.initialize({
          startOnLoad: false,
          theme: document.documentElement.classList.contains('dark') ? 'dark' : 'base',
          themeVariables: {
            primaryColor: '#3b82f6',
            primaryTextColor: '#1f2937',
            primaryBorderColor: '#e5e7eb',
            lineColor: '#6b7280',
            tertiaryColor: '#f9fafb',
            background: '#ffffff',
            secondaryColor: '#f3f4f6',
            tertiaryTextColor: '#374151',
            tertiaryBorderColor: '#d1d5db',
            quaternaryColor: '#e5e7eb',
            fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
            fontSize: '14px'
          },
          flowchart: {
            htmlLabels: true,
            curve: 'basis',
            padding: 20,
            nodeSpacing: 50,
            rankSpacing: 50,
            diagramPadding: 20,
            useMaxWidth: true
          },
          gantt: {
            leftPadding: 75,
            gridLineStartPadding: 35,
            fontSize: 12,
            sectionFontSize: 14,
            fontFamily: 'ui-sans-serif, system-ui, sans-serif',
            useMaxWidth: true
          },
          mindmap: {
            padding: 20,
            maxNodeSizeX: 200,
            maxNodeSizeY: 100,
            useMaxWidth: true
          },
          timeline: {
            padding: 20,
            useMaxWidth: true
          },
          journey: {
            diagramMarginX: 50,
            diagramMarginY: 10,
            leftMargin: 150,
            useMaxWidth: true
          }
        });

        // Clear previous content
        elementRef.current.innerHTML = '';

        // Generate unique ID for the chart
        const chartId = `mermaid-${Math.random().toString(36).substr(2, 9)}`;

        // Render the chart
        const result = await mermaid.render(chartId, chart);
        
        if (elementRef.current) {
          elementRef.current.innerHTML = result.svg;
          
          // Apply additional styling for better quality
          const svgElement = elementRef.current.querySelector('svg');
          if (svgElement) {
            svgElement.setAttribute('width', '100%');
            svgElement.setAttribute('height', 'auto');
            svgElement.style.maxWidth = '100%';
            svgElement.style.height = 'auto';
            svgElement.style.display = 'block';
            svgElement.style.margin = '0 auto';
            
            // Add class for PNG export targeting
            svgElement.classList.add('mermaid-chart-svg');
            setChartElement(svgElement);
          }
        }

        setIsLoading(false);
      } catch (err) {
        console.error('Mermaid rendering error:', err);
        setError(err instanceof Error ? err.message : 'Failed to render chart');
        setIsLoading(false);
      }
    };

    renderChart();
  }, [chart]);

  const handleExportPNG = async () => {
    const svgElement = elementRef.current?.querySelector('svg') as SVGElement;
    if (!svgElement) {
      toast({
        title: "Export Failed",
        description: "No chart found to export",
        variant: "destructive"
      });
      return;
    }

    try {
      // Get SVG data
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      
      // Create high-resolution canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context not available');

      // Set high DPI for crisp export
      const scale = 3; // 3x for very high quality
      const svgRect = svgElement.getBoundingClientRect();
      
      canvas.width = svgRect.width * scale;
      canvas.height = svgRect.height * scale;
      
      // Scale context and set white background
      ctx.scale(scale, scale);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width / scale, canvas.height / scale);

      // Load and draw SVG
      const img = new Image();
      const url = URL.createObjectURL(svgBlob);
      
      img.onload = () => {
        ctx.drawImage(img, 0, 0, svgRect.width, svgRect.height);
        
        // Export as high-quality PNG
        canvas.toBlob((blob) => {
          if (blob) {
            const link = document.createElement('a');
            link.download = `novaflow-chart-${Date.now()}.png`;
            link.href = URL.createObjectURL(blob);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            toast({
              title: "Export Successful",
              description: "Chart exported as high-quality PNG"
            });
          }
        }, 'image/png', 1.0);
        
        URL.revokeObjectURL(url);
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        throw new Error('Failed to load SVG for export');
      };
      
      img.src = url;
    } catch (err) {
      console.error('Export error:', err);
      toast({
        title: "Export Failed",
        description: err instanceof Error ? err.message : "Failed to export chart",
        variant: "destructive"
      });
    }
  };

  if (!chart) {
    return (
      <Card className={`p-8 text-center ${className}`}>
        <div className="text-muted-foreground">
          <RefreshCw className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No chart to display</p>
          <p className="text-sm mt-1">Generate a chart to see the preview</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`p-8 text-center border-destructive ${className}`}>
        <div className="text-destructive">
          <p className="font-semibold">Chart Rendering Error</p>
          <p className="text-sm mt-2">{error}</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`relative ${className}`}>
      {showControls && (
        <div className="absolute top-4 right-4 z-10 flex space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportPNG}
            data-export-png
          >
            <Download className="w-4 h-4 mr-2" />
            PNG
          </Button>
          {onEditCode && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onEditCode}
            >
              <Code className="w-4 h-4 mr-2" />
              Edit
            </Button>
          )}
        </div>
      )}
      
      <div className="p-6">
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
              <p className="text-sm text-muted-foreground">Rendering chart...</p>
            </div>
          </div>
        ) : (
          <div 
            ref={elementRef} 
            className="mermaid-chart w-full min-h-[400px] flex items-center justify-center"
          />
        )}
      </div>
    </Card>
  );
}