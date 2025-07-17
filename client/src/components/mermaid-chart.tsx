import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Code, Maximize2, RefreshCw, AlertCircle } from "lucide-react";
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
  const [retryCount, setRetryCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    let isMounted = true;

    const renderChart = async () => {
      if (!chart || !elementRef.current || !isMounted) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Clear previous content immediately
        elementRef.current.innerHTML = '';

        // Initialize mermaid with simplified configuration
        await mermaid.initialize({
          startOnLoad: false,
          theme: 'base',
          securityLevel: 'loose',
          flowchart: { useMaxWidth: true },
          gantt: { useMaxWidth: true },
          mindmap: { useMaxWidth: true },
          timeline: { useMaxWidth: true }
        });

        // Add a small delay to ensure DOM is ready
        await new Promise(resolve => setTimeout(resolve, 100));

        if (!isMounted || !elementRef.current) return;

        // Generate unique ID for the chart
        const chartId = `chart-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;

        try {
          // Render the chart with error handling
          const result = await mermaid.render(chartId, chart);
          
          if (!isMounted || !elementRef.current) return;

          // Insert the SVG
          elementRef.current.innerHTML = result.svg;
          
          // Apply styling
          const svgElement = elementRef.current.querySelector('svg');
          if (svgElement) {
            svgElement.setAttribute('width', '100%');
            svgElement.setAttribute('height', 'auto');
            svgElement.style.maxWidth = '100%';
            svgElement.style.height = 'auto';
            svgElement.style.display = 'block';
            svgElement.classList.add('mermaid-chart-svg');
          }

          setIsLoading(false);
          setRetryCount(0);
        } catch (renderError) {
          console.error('Mermaid render error:', renderError);
          throw renderError;
        }

      } catch (err) {
        console.error('Chart rendering failed:', err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to render chart');
          setIsLoading(false);
        }
      }
    };

    // Add small delay before rendering
    const timer = setTimeout(() => {
      renderChart();
    }, 50);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [chart, retryCount]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

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