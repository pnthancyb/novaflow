import { Button } from "@/components/ui/button";
import { Download, FileImage, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ChartExportProps {
  svgElement: SVGElement | null;
  mermaidCode: string;
  fileName?: string;
}

export function ChartExport({ svgElement, mermaidCode, fileName = "novaflow-chart" }: ChartExportProps) {
  const { toast } = useToast();

  const exportToPNG = async (quality: number = 2) => {
    if (!svgElement) {
      toast({
        title: "Export Failed",
        description: "No chart available to export",
        variant: "destructive"
      });
      return;
    }

    try {
      // Clone the SVG to avoid modifying the original
      const svgClone = svgElement.cloneNode(true) as SVGElement;
      
      // Get SVG dimensions
      const svgRect = svgElement.getBoundingClientRect();
      const svgWidth = svgRect.width || 800;
      const svgHeight = svgRect.height || 600;

      // Create canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context not available');

      // Set canvas size with quality multiplier
      canvas.width = svgWidth * quality;
      canvas.height = svgHeight * quality;
      
      // Scale context
      ctx.scale(quality, quality);
      
      // Set white background
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, svgWidth, svgHeight);

      // Convert SVG to data URL
      const svgData = new XMLSerializer().serializeToString(svgClone);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      // Create and load image
      const img = new Image();
      
      await new Promise((resolve, reject) => {
        img.onload = () => {
          try {
            ctx.drawImage(img, 0, 0, svgWidth, svgHeight);
            resolve(true);
          } catch (err) {
            reject(err);
          }
        };
        
        img.onerror = () => reject(new Error('Failed to load SVG'));
        img.src = url;
      });

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const link = document.createElement('a');
          link.download = `${fileName}-${Date.now()}.png`;
          link.href = URL.createObjectURL(blob);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          toast({
            title: "Export Successful",
            description: "Chart exported as PNG"
          });
        } else {
          throw new Error('Failed to create PNG blob');
        }
      }, 'image/png', 1.0);

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PNG export error:', err);
      toast({
        title: "Export Failed",
        description: err instanceof Error ? err.message : "Failed to export chart",
        variant: "destructive"
      });
    }
  };

  const exportToSVG = () => {
    if (!svgElement) {
      toast({
        title: "Export Failed",
        description: "No chart available to export",
        variant: "destructive"
      });
      return;
    }

    try {
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      
      const link = document.createElement('a');
      link.download = `${fileName}-${Date.now()}.svg`;
      link.href = URL.createObjectURL(blob);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Export Successful",
        description: "Chart exported as SVG"
      });
    } catch (err) {
      console.error('SVG export error:', err);
      toast({
        title: "Export Failed",
        description: "Failed to export chart as SVG",
        variant: "destructive"
      });
    }
  };

  const exportToText = () => {
    if (!mermaidCode) {
      toast({
        title: "Export Failed",
        description: "No chart code to export",
        variant: "destructive"
      });
      return;
    }

    try {
      const blob = new Blob([mermaidCode], { type: 'text/plain;charset=utf-8' });
      
      const link = document.createElement('a');
      link.download = `${fileName}-${Date.now()}.txt`;
      link.href = URL.createObjectURL(blob);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Export Successful",
        description: "Chart code exported as text file"
      });
    } catch (err) {
      console.error('Text export error:', err);
      toast({
        title: "Export Failed",
        description: "Failed to export chart code",
        variant: "destructive"
      });
    }
  };

  const hasChart = svgElement !== null;

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => exportToPNG(2)}
        disabled={!hasChart}
        title="Export as PNG (High Quality)"
      >
        <FileImage className="w-4 h-4 mr-1" />
        <span className="hidden sm:inline">PNG</span>
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={exportToSVG}
        disabled={!hasChart}
        title="Export as SVG"
        className="hidden sm:flex"
      >
        <Download className="w-4 h-4 mr-1" />
        <span className="hidden lg:inline">SVG</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={exportToText}
        disabled={!mermaidCode}
        title="Export code as text"
        className="hidden md:flex"
      >
        <FileText className="w-4 h-4 mr-1" />
        <span className="hidden lg:inline">Code</span>
      </Button>
    </div>
  );
}