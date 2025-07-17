import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, FileImage, FileText, Code, BarChart3 } from "lucide-react";
import { MermaidChart } from "@/components/mermaid-chart";
import { CodeEditorModal } from "@/components/code-editor-modal";

interface ChartDisplayPanelProps {
  mermaidCode: string;
  onUpdateChart: (code: string) => void;
  isGenerating?: boolean;
}

export function ChartDisplayPanel({ mermaidCode, onUpdateChart, isGenerating = false }: ChartDisplayPanelProps) {
  const [showCodeEditor, setShowCodeEditor] = useState(false);

  const exportToPNG = () => {
    // Get the SVG element from the rendered chart
    const svgElement = document.querySelector('.mermaid-chart svg') as SVGElement;
    if (!svgElement) return;

    // Create a canvas and draw the SVG
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const data = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([data], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      // Download the canvas as PNG
      canvas.toBlob((blob) => {
        if (blob) {
          const link = document.createElement('a');
          link.download = 'gantt-chart.png';
          link.href = URL.createObjectURL(blob);
          link.click();
        }
      });
      
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const exportToPDF = () => {
    // For PDF export, we would typically use a library like jsPDF
    // For now, we'll simulate the export
    const link = document.createElement('a');
    const content = `data:text/plain;charset=utf-8,${encodeURIComponent(mermaidCode)}`;
    link.href = content;
    link.download = 'gantt-chart.txt';
    link.click();
  };

  return (
    <>
      <div className="w-1/2 border-l border-border flex flex-col">
        {/* Chart Controls */}
        <div className="p-4 border-b border-border bg-muted">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Generated Gantt Chart</h3>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={exportToPNG} disabled={!mermaidCode}>
                <FileImage className="w-4 h-4 mr-1" />
                PNG
              </Button>
              <Button variant="outline" size="sm" onClick={exportToPDF} disabled={!mermaidCode}>
                <FileText className="w-4 h-4 mr-1" />
                PDF
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowCodeEditor(true)}
                disabled={!mermaidCode}
              >
                <Code className="w-4 h-4 mr-1" />
                Code
              </Button>
            </div>
          </div>
          
          {/* AI Processing Status */}
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <div className={`w-2 h-2 rounded-full ${
              isGenerating ? 'bg-yellow-500 animate-pulse' : 
              mermaidCode ? 'bg-green-500' : 'bg-gray-400'
            }`} />
            <span>
              {isGenerating ? 'Generating chart...' : 
               mermaidCode ? 'Chart generated successfully' : 'Ready to generate chart'}
            </span>
          </div>
        </div>

        {/* Chart Container */}
        <div className="flex-1 p-4 overflow-auto custom-scrollbar">
          <Card className="min-h-full">
            <CardContent className="p-6">
              {isGenerating ? (
                <div className="w-full h-96 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-muted border-t-primary rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground font-medium">Generating Gantt chart with AI...</p>
                    <p className="text-sm text-muted-foreground mt-1">This may take a few moments</p>
                  </div>
                </div>
              ) : mermaidCode ? (
                <div className="mermaid-chart">
                  <MermaidChart chart={mermaidCode} />
                </div>
              ) : (
                <div className="w-full h-96 flex items-center justify-center border-2 border-dashed border-border rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="w-16 h-16 text-muted-foreground mb-4 mx-auto" />
                    <p className="text-muted-foreground mb-2">AI-Generated Gantt Chart</p>
                    <p className="text-sm text-muted-foreground">Chart will appear here after generation</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Code Editor Modal */}
      {showCodeEditor && (
        <CodeEditorModal
          code={mermaidCode}
          onSave={onUpdateChart}
          onClose={() => setShowCodeEditor(false)}
        />
      )}
    </>
  );
}
