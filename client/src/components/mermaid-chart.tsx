import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Code, RefreshCw, AlertCircle } from "lucide-react";
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rendered, setRendered] = useState(false);
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);
  const mermaidInitialized = useRef(false);

  useEffect(() => {
    if (!chart || !containerRef.current) return;

    const renderChart = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Initialize mermaid if not already done
        if (!mermaidInitialized.current) {
          mermaid.initialize({
            theme: 'default',
            startOnLoad: false,
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: 14,
            flowchart: {
              useMaxWidth: true,
              htmlLabels: true,
              curve: 'basis',
            },
            gantt: {
              useMaxWidth: true,
              fontSize: 11,
              fontFamily: 'Inter, system-ui, sans-serif',
              gridLineStartPadding: 350,
              sectionFontSize: 24,
              numberSectionStyles: 4,
            },
            sequence: {
              useMaxWidth: true,
              diagramMarginX: 50,
              diagramMarginY: 10,
            },
            er: {
              useMaxWidth: true,
            },
            mindmap: {
              useMaxWidth: true,
            },
            timeline: {
              useMaxWidth: true,
            },
            gitGraph: {
              useMaxWidth: true,
            },
          });
          mermaidInitialized.current = true;
        }

        const container = containerRef.current;
        container.innerHTML = '';

        // Clean up the chart code and fix common syntax issues
        let cleanedChart = chart
          .replace(/^```[\w]*\n?/, '')
          .replace(/\n?```$/, '')
          .trim();

        // Fix common Mermaid syntax issues
        cleanedChart = cleanedChart
          // Remove invalid title statements inside graph declarations
          .replace(/^(graph\s+\w+)\s*\n\s*title\s+.*$/gm, '$1')
          // Remove standalone title lines that appear after graph declaration
          .replace(/\n\s*title\s+.*$/gm, '')
          // Fix node definitions with spaces and special characters
          .replace(/(\w+)\s*-->\s*([^[\n]+)\[([^\]]+)\]/g, (match, from, nodeText, label) => {
            // Create proper node ID and connection
            const nodeId = nodeText.trim().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
            return `${from} --> ${nodeId}[${label}]`;
          })
          // Fix standalone node definitions that might have issues
          .replace(/([A-Za-z0-9_]+)\s*\[\s*([^\]]+)\s*\]/g, '$1[$2]')
          // Fix arrow connections with proper spacing
          .replace(/\s*-->\s*/g, ' --> ')
          // Clean up multiple newlines
          .replace(/\n\s*\n\s*\n/g, '\n\n')
          .trim();

        const id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const element = document.createElement('div');
        element.id = id;
        element.style.width = '100%';
        element.style.height = 'auto';
        container.appendChild(element);

        const { svg } = await mermaid.render(id, cleanedChart);
        element.innerHTML = svg;
        setRendered(true);

        // Style the SVG for better display
        const svgElement = element.querySelector('svg');
        if (svgElement) {
          svgElement.style.maxWidth = '100%';
          svgElement.style.height = 'auto';
          svgElement.style.display = 'block';
          svgElement.style.margin = '0 auto';
          svgElement.style.backgroundColor = 'transparent';
        }

      } catch (error) {
        console.error('Mermaid rendering error:', error);
        setError(`Failed to render chart: ${error.message || 'Invalid chart syntax'}`);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(renderChart, 200);
    return () => clearTimeout(timeoutId);
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

      // Create canvas for PNG export
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context not available');

      // Set canvas size
      const scale = 2; // 2x for high quality
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

        // Export as PNG
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
              description: "Chart exported as PNG"
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
          <AlertCircle className="w-8 h-8 mx-auto mb-2" />
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
            disabled={!rendered}
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
            ref={containerRef} 
            className="mermaid-chart w-full min-h-[400px] flex items-center justify-center"
          />
        )}
      </div>
    </Card>
  );
}