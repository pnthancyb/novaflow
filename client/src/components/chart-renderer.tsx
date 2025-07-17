import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { useToast } from "@/hooks/use-toast";

interface ChartRendererProps {
  code: string;
  className?: string;
  onRenderComplete?: (svgElement: SVGElement | null) => void;
}

export function ChartRenderer({ code, className = "", onRenderComplete }: ChartRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [svgElement, setSvgElement] = useState<SVGElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize Mermaid with proper configuration
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
        fontFamily: 'Inter, system-ui, sans-serif',
        gridLineStartPadding: 350
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

  useEffect(() => {
    if (!code || !containerRef.current) {
      setSvgElement(null);
      onRenderComplete?.(null);
      return;
    }

    const renderChart = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Clean up previous chart
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }

        // Clean the mermaid code
        const cleanCode = code
          .replace(/^```[\w]*\n?/, '')
          .replace(/\n?```$/, '')
          .trim();

        if (!cleanCode) {
          throw new Error('Empty chart code');
        }

        // Generate unique ID for this chart
        const chartId = `mermaid-chart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // Validate syntax first
        const isValid = await mermaid.parse(cleanCode);
        if (!isValid) {
          throw new Error('Invalid Mermaid syntax');
        }

        // Render the chart
        const { svg } = await mermaid.render(chartId, cleanCode);
        
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
          
          // Get the SVG element
          const svgEl = containerRef.current.querySelector('svg') as SVGElement;
          if (svgEl) {
            // Add responsive styling
            svgEl.style.width = '100%';
            svgEl.style.height = 'auto';
            svgEl.setAttribute('viewBox', svgEl.getAttribute('viewBox') || '0 0 800 600');
            
            setSvgElement(svgEl);
            onRenderComplete?.(svgEl);
          }
        }

        setIsLoading(false);
      } catch (err) {
        console.error('Chart rendering error:', err);
        setError(err instanceof Error ? err.message : 'Failed to render chart');
        setIsLoading(false);
        setSvgElement(null);
        onRenderComplete?.(null);
        
        // Show error to user
        toast({
          title: "Chart Rendering Failed",
          description: err instanceof Error ? err.message : "Failed to render chart",
          variant: "destructive"
        });
      }
    };

    renderChart();
  }, [code, toast, onRenderComplete]);

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center h-full ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Rendering chart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center h-full ${className}`}>
        <div className="text-center text-destructive">
          <p className="text-sm font-medium">Chart Error</p>
          <p className="text-xs mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      className={`w-full h-full overflow-auto p-2 ${className}`}
    />
  );
}