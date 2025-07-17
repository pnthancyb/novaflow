
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, FileImage, FileText, Code, BarChart3, AlertCircle } from "lucide-react";
import { MermaidChart } from "@/components/mermaid-chart";
import { CodeEditorModal } from "@/components/code-editor-modal";
import { useToast } from "@/hooks/use-toast";

interface ChartDisplayPanelProps {
  mermaidCode: string;
  onUpdateChart: (code: string) => void;
  isGenerating?: boolean;
  error?: string | null;
}

export function ChartDisplayPanel({ 
  mermaidCode, 
  onUpdateChart, 
  isGenerating = false,
  error = null 
}: ChartDisplayPanelProps) {
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const { toast } = useToast();

  const exportToPNG = () => {
    const svgElement = document.querySelector('.mermaid-chart svg') as SVGElement;
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
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const data = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([data], { type: 'image/svg+xml;charset=utf-8' });
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

  const exportToText = () => {
    if (!mermaidCode) {
      toast({
        title: "Export Failed",
        description: "No chart code to export",
        variant: "destructive"
      });
      return;
    }

    const link = document.createElement('a');
    const content = `data:text/plain;charset=utf-8,${encodeURIComponent(mermaidCode)}`;
    link.href = content;
    link.download = `novaflow-chart-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Successful",
      description: "Chart code exported as text file"
    });
  };

  const getStatusMessage = () => {
    if (error) return 'Error occurred during generation';
    if (isGenerating) return 'AI is creating visualization...';
    if (mermaidCode) return 'Visualization generated successfully';
    return 'Ready to generate visualization';
  };

  const getStatusColor = () => {
    if (error) return 'bg-red-500';
    if (isGenerating) return 'bg-yellow-500 animate-pulse';
    if (mermaidCode) return 'bg-green-500';
    return 'bg-gray-400';
  };

  return (
    <>
      <div className="w-1/2 border-l border-border flex flex-col">
        {/* Chart Controls */}
        <div className="p-4 border-b border-border bg-muted">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">AI-Generated Visualization</h3>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={exportToPNG} 
                disabled={!mermaidCode || isGenerating}
              >
                <FileImage className="w-4 h-4 mr-1" />
                PNG
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={exportToText} 
                disabled={!mermaidCode || isGenerating}
              >
                <FileText className="w-4 h-4 mr-1" />
                Code
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowCodeEditor(true)}
                disabled={!mermaidCode || isGenerating}
              >
                <Code className="w-4 h-4 mr-1" />
                Edit
              </Button>
            </div>
          </div>
          
          {/* AI Processing Status */}
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
            <span>{getStatusMessage()}</span>
          </div>

          {error && (
            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            </div>
          )}
        </div>

        {/* Chart Container */}
        <div className="flex-1 p-4 overflow-auto custom-scrollbar">
          <Card className="min-h-full">
            <CardContent className="p-0">
              {isGenerating ? (
                <div className="w-full h-96 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-muted border-t-primary rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground font-medium">AI is creating your visualization...</p>
                    <p className="text-sm text-muted-foreground mt-1">Analyzing data and selecting optimal chart type</p>
                  </div>
                </div>
              ) : error ? (
                <div className="w-full h-96 flex items-center justify-center">
                  <div className="text-center text-red-600">
                    <AlertCircle className="w-16 h-16 mx-auto mb-4" />
                    <p className="font-medium mb-2">Failed to Generate Chart</p>
                    <p className="text-sm text-muted-foreground">{error}</p>
                  </div>
                </div>
              ) : mermaidCode ? (
                <div className="w-full">
                  <MermaidChart 
                    chart={mermaidCode} 
                    className="w-full"
                    showControls={false}
                  />
                </div>
              ) : (
                <div className="w-full h-96 flex items-center justify-center border-2 border-dashed border-border rounded-lg m-6">
                  <div className="text-center">
                    <BarChart3 className="w-16 h-16 text-muted-foreground mb-4 mx-auto" />
                    <p className="text-muted-foreground mb-2 font-medium">AI-Generated Visualization</p>
                    <p className="text-sm text-muted-foreground">AI will create the perfect chart for your data</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Code Editor Modal */}
      {showCodeEditor && mermaidCode && (
        <CodeEditorModal
          code={mermaidCode}
          onSave={onUpdateChart}
          onClose={() => setShowCodeEditor(false)}
        />
      )}
    </>
  );
}
