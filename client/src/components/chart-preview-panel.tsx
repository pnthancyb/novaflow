import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChartRenderer } from "@/components/chart-renderer";
import { ChartExport } from "@/components/chart-export";
import { Move, Code, Eye } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { DraggableChart } from "@/components/draggable-chart";

interface ChartPreviewPanelProps {
  mermaidCode: string;
  onUpdateChart: (code: string) => void;
  isGenerating?: boolean;
  error?: string | null;
}

export function ChartPreviewPanel({ 
  mermaidCode, 
  onUpdateChart, 
  isGenerating = false,
  error = null 
}: ChartPreviewPanelProps) {
  const { t } = useTranslation();
  const [showDraggableChart, setShowDraggableChart] = useState(false);
  const [svgElement, setSvgElement] = useState<SVGElement | null>(null);

  const toggleDraggable = () => {
    setShowDraggableChart(true);
  };

  const handleEditCode = () => {
    console.log("Edit code clicked");
  };

  const handleRenderComplete = (svg: SVGElement | null) => {
    setSvgElement(svg);
  };

  return (
    <>
      <div className="h-full flex flex-col p-4">
        <div className="flex-shrink-0 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2 header-title">Grafik Önizleme</h1>
              <p className="text-base text-muted-foreground header-subtitle">Oluşturulan görselleştirmelerinizi görüntüleyin ve düzenleyin</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleDraggable}
                disabled={!mermaidCode}
                title="Open in draggable window"
              >
                <Move className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleEditCode}
                disabled={!mermaidCode}
                title="Edit code"
              >
                <Code className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <Card className="flex-1 flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">
                Generated Chart
              </CardTitle>
              <ChartExport 
                svgElement={svgElement}
                mermaidCode={mermaidCode}
                fileName="novaflow-chart"
              />
            </div>
          </CardHeader>

          <CardContent className="flex-1 overflow-hidden p-0">
            {error ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-destructive">
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            ) : mermaidCode ? (
              <div className="h-full flex items-center justify-center overflow-hidden">
                <ChartRenderer 
                  code={mermaidCode} 
                  className="w-full h-full"
                  onRenderComplete={handleRenderComplete}
                />
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <Eye className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-lg font-medium mb-2">No Visualization Yet</p>
                  <p className="text-sm">
                    Generate a chart using AI Tasks or AI Visualization tabs to see it here
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Draggable Chart Modal */}
      <DraggableChart
        isOpen={showDraggableChart}
        onClose={() => setShowDraggableChart(false)}
        mermaidCode={mermaidCode}
        onUpdateChart={onUpdateChart}
      />
    </>
  );
}