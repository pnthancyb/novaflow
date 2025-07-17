import { useState } from "react";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { TaskInputPanel } from "@/components/task-input-panel";
import { PromptGenerator } from "@/components/prompt-generator";
import { DraggableChart } from "@/components/draggable-chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Code, Download, FileText } from "lucide-react";
import { ExportModal } from "@/components/export-modal";
import { useTranslation } from "@/hooks/use-translation";

export default function Dashboard() {
  const { t } = useTranslation();
  const [currentProjectId] = useState(1); // Mock project ID for demo
  const [mermaidCode, setMermaidCode] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showChart, setShowChart] = useState(false);

  const handleGenerateChart = (code: string) => {
    setIsGenerating(true);
    // Simulate AI processing delay
    setTimeout(() => {
      setMermaidCode(code);
      setIsGenerating(false);
      setShowChart(true);
    }, 1000);
  };

  const handleUpdateChart = (code: string) => {
    setMermaidCode(code);
  };

  const handleSelectProject = (project: any) => {
    console.log("Selected project:", project);
    // Handle project selection
  };

  const handleApplyTemplate = (template: any) => {
    // Auto-populate both the schema and the prompt
    setMermaidCode(template.schema);
    setShowChart(true);
    // Also pass the prompt to the prompt generator component
    if (template.prompt) {
      // Store template prompt for the prompt generator
      sessionStorage.setItem('templatePrompt', template.prompt);
      // Trigger a custom event to update the prompt generator
      window.dispatchEvent(new CustomEvent('templateApplied', { detail: template }));
    }
  };

  const exportToPNG = () => {
    // Trigger export from the MermaidChart component
    const chartComponent = document.querySelector('.mermaid-chart-svg') as SVGElement;
    if (chartComponent) {
      // The MermaidChart component handles the export internally
      const exportButton = document.querySelector('[data-export-png]') as HTMLButtonElement;
      if (exportButton) {
        exportButton.click();
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onSelectProject={handleSelectProject}
        onApplyTemplate={handleApplyTemplate}
      />
      
      <div className="flex flex-col lg:flex-row h-screen pt-16">
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        
        <main className="flex-1 flex flex-col">
          <div className="flex-1 flex flex-col lg:flex-row">
            <div className="flex-1 min-h-0">
              <Tabs defaultValue="structured" className="h-full flex flex-col">
                <div className="border-b border-border px-4 lg:px-6 py-2 flex-shrink-0">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="structured" className="text-sm">Structured Input</TabsTrigger>
                    <TabsTrigger value="prompt" className="text-sm">AI Prompt</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="structured" className="m-0 h-full">
                  <TaskInputPanel 
                    projectId={currentProjectId}
                    onGenerateChart={handleGenerateChart}
                  />
                </TabsContent>
                
                <TabsContent value="prompt" className="m-0 h-full">
                  <PromptGenerator onGenerateChart={handleGenerateChart} />
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Chart Controls */}
          <div className="border-t border-border bg-muted p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  isGenerating ? 'bg-yellow-500 animate-pulse' : 
                  mermaidCode ? 'bg-green-500' : 'bg-gray-400'
                }`} />
                <span className="text-sm">
                  {isGenerating ? t('dashboard.generating') : 
                   mermaidCode ? t('dashboard.ready') : t('dashboard.noVisualization')}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowChart(true)}
                  disabled={!mermaidCode}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {t('chart.preview')}
                </Button>
                <ExportModal 
                  mermaidCode={mermaidCode}
                  onExport={(format, quality) => console.log('Exported:', format, quality)}
                />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Draggable Chart */}
      <DraggableChart
        mermaidCode={mermaidCode}
        isVisible={showChart}
        onClose={() => setShowChart(false)}
        onUpdateChart={handleUpdateChart}
      />
    </div>
  );
}
