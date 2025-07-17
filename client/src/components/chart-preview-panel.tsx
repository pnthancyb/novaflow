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
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base lg:text-lg font-semibold">
              {t('chart.preview')}
            </CardTitle>
            <div className="flex items-center space-x-1 lg:space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleDraggable}
                disabled={!mermaidCode}
                title="Open in draggable window"
                className="hidden sm:flex"
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
                <Code className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
              <ChartExport 
                svgElement={svgElement}
                mermaidCode={mermaidCode}
                fileName="novaflow-chart"
              />
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 p-4 min-h-0">
          {isGenerating ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">
                  {t('dashboard.generating')}
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-destructive">
                <p className="text-sm">{error}</p>
              </div>
            </div>
          ) : mermaidCode ? (
            <div className="h-full overflow-auto">
              <ChartRenderer 
                code={mermaidCode} 
                className="w-full h-full"
                onRenderComplete={handleRenderComplete}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-muted-foreground">
                <Eye className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">
                  {t('dashboard.noVisualization')}
                </p>
                <p className="text-xs mt-1">
                  Generate a chart to see the preview here
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Draggable Chart Modal */}
      <DraggableChart
        mermaidCode={mermaidCode}
        isVisible={showDraggableChart}
        onClose={() => setShowDraggableChart(false)}
        onUpdateChart={onUpdateChart}
        onEditCode={handleEditCode}
      />
    </>
  );
}