
import { useEffect, useRef, useState, useCallback } from "react";
import mermaid from "mermaid";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Code, RefreshCw, AlertCircle, BarChart3 } from "lucide-react";
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
  const chartRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRendered, setIsRendered] = useState(false);
  const { toast } = useToast();
  const chartId = useRef<string>(`mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);

  // Initialize Mermaid once
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: 14,
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'basis'
      },
      gantt: {
        useMaxWidth: true,
        fontSize: 12,
        fontFamily: 'Inter, system-ui, sans-serif'
      },
      sequence: {
        useMaxWidth: true
      },
      er: {
        useMaxWidth: true
      },
      mindmap: {
        useMaxWidth: true
      }
    });
  }, []);

  const cleanMermaidCode = useCallback((code: string): string => {
    if (!code) return '';
    
    // Remove code blocks and clean up
    let cleaned = code
      .replace(/^```[\w]*\n?/, '')
      .replace(/\n?```$/, '')
      .trim();

    // Fix common syntax issues
    cleaned = cleaned
      // Remove title statements inside graph declarations
      .replace(/^(graph\s+\w+)\s*\n\s*title\s+.*$/gm, '$1')
      .replace(/\n\s*title\s+.*$/gm, '')
      // Fix malformed graph declarations like "graph LR_A" 
      .replace(/^graph\s+([A-Z]+)_([A-Za-z0-9_]+)/gm, 'graph $1\n    $2')
      // Fix node definitions with underscores in wrong places
      .replace(/([A-Za-z0-9]+)_([A-Za-z0-9_]+)\[/g, '$1[$2 ')
      // Fix arrow syntax with malformed connections
      .replace(/-->\s*-+\^?/g, ' --> ')
      .replace(/\s*-->\s*/g, ' --> ')
      // Fix standalone node definitions
      .replace(/^\s*([A-Za-z0-9]+)\[([^\]]+)\]\s*$/gm, '    $1[$2]')
      // Fix connections between nodes
      .replace(/^\s*([A-Za-z0-9]+)\s*-->\s*([A-Za-z0-9]+)\s*$/gm, '    $1 --> $2')
      // Clean up multiple newlines
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      .trim();

    return cleaned;
  }, []);

  const renderChart = useCallback(async () => {
    if (!chart || !chartRef.current) {
      console.log('No chart or chartRef available');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setIsRendered(false);

      const container = chartRef.current;
      container.innerHTML = '';

      const cleanedChart = cleanMermaidCode(chart);
      console.log('Original chart code:', chart);
      console.log('Cleaned chart code:', cleanedChart);
      
      if (!cleanedChart) {
        throw new Error('No valid chart code provided');
      }

      // Update chart ID for each render to avoid conflicts
      chartId.current = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Create a unique element for this render
      const element = document.createElement('div');
      element.id = chartId.current;
      container.appendChild(element);

      // Validate Mermaid syntax before rendering
      try {
        await mermaid.parse(cleanedChart);
      } catch (parseError) {
        throw new Error(`Invalid Mermaid syntax: ${parseError instanceof Error ? parseError.message : 'Parse error'}`);
      }

      // Render with Mermaid
      const { svg } = await mermaid.render(chartId.current, cleanedChart);
      
      if (!svg || svg.trim() === '') {
        throw new Error('Failed to generate SVG from chart code');
      }

      console.log('SVG generated successfully, length:', svg.length);
      element.innerHTML = svg;

      // Style the rendered SVG
      const svgElement = element.querySelector('svg');
      if (svgElement) {
        svgElement.style.maxWidth = '100%';
        svgElement.style.height = 'auto';
        svgElement.style.display = 'block';
        svgElement.style.margin = '0 auto';
        svgElement.style.backgroundColor = 'transparent';
        console.log('Chart rendered successfully');
      } else {
        throw new Error('SVG element not found after rendering');
      }

      setIsRendered(true);
    } catch (err) {
      console.error('Mermaid rendering error:', err);
      console.error('Chart code that failed:', chart);
      const errorMessage = err instanceof Error ? err.message : 'Unknown rendering error';
      setError(`Failed to render chart: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [chart, cleanMermaidCode]);

  // Render chart when code changes
  useEffect(() => {
    console.log('Chart effect triggered, chart:', chart ? 'has content' : 'empty');
    if (chart) {
      const timer = setTimeout(() => {
        console.log('Starting chart render...');
        renderChart();
      }, 300);
      return () => clearTimeout(timer);
    } else {
      console.log('No chart content, clearing state');
      setIsRendered(false);
      setError(null);
    }
  }, [chart, renderChart]);

  const handleExportPNG = async () => {
    const svgElement = chartRef.current?.querySelector('svg') as SVGElement;
    if (!svgElement) {
      toast({
        title: "Export Failed",
        description: "No chart found to export",
        variant: "destructive"
      });
      return;
    }

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context not available');

      const svgRect = svgElement.getBoundingClientRect();
      const scale = 2;
      
      canvas.width = svgRect.width * scale;
      canvas.height = svgRect.height * scale;
      
      ctx.scale(scale, scale);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width / scale, canvas.height / scale);

      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, svgRect.width, svgRect.height);
        
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

  const handleRetry = () => {
    setError(null);
    renderChart();
  };

  // No chart content
  if (!chart) {
    return (
      <Card className={`p-8 text-center ${className}`}>
        <div className="text-muted-foreground">
          <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="font-medium">No chart to display</p>
          <p className="text-sm mt-1">Generate a chart to see the preview</p>
        </div>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className={`p-8 text-center border-destructive ${className}`}>
        <div className="text-destructive">
          <AlertCircle className="w-8 h-8 mx-auto mb-2" />
          <p className="font-semibold">Chart Rendering Error</p>
          <p className="text-sm mt-2 bg-destructive/10 p-2 rounded">{error}</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-4"
            onClick={handleRetry}
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
            disabled={!isRendered}
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
            ref={chartRef} 
            className="mermaid-chart w-full min-h-[400px] flex items-center justify-center overflow-auto"
          />
        )}
      </div>
    </Card>
  );
}
