import { useState } from "react";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { TaskInputPanel } from "@/components/task-input-panel";
import { PromptGenerator } from "@/components/prompt-generator";
import { ChartDisplayPanel } from "@/components/chart-display-panel";
import { ChartPreviewPanel } from "@/components/chart-preview-panel";
import { QuickTipsWidget } from "@/components/quick-tips-widget";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Code, Download, FileText } from "lucide-react";
import { ExportModal } from "@/components/export-modal";
import { useTranslation } from "@/hooks/use-translation";
import { useQuery } from "@tanstack/react-query";

export default function Dashboard() {
  const { t } = useTranslation();
  const [currentProjectId] = useState(1); // Mock project ID for demo
  const [mermaidCode, setMermaidCode] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState("tasks");

  // Fetch tasks for Quick Tips context
  const { data: tasksData } = useQuery({
    queryKey: [`/api/projects/${currentProjectId}/tasks`],
    enabled: !!currentProjectId,
  });

  const taskCount = tasksData?.length || 0;

  const handleGenerateChart = (code: string) => {
    setIsGenerating(true);
    // Simulate AI processing delay
    setTimeout(() => {
      setMermaidCode(code);
      setIsGenerating(false);
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
    <div className="h-screen bg-background overflow-hidden">
      <Header 
        onSelectProject={handleSelectProject}
        onApplyTemplate={handleApplyTemplate}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="layout-container flex">
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)}
        />

        <main className="main-content flex-1">
          <div className="flex-1 flex flex-col overflow-hidden">
            <Tabs defaultValue="tasks" value={currentTab} onValueChange={setCurrentTab} className="h-full flex flex-col">
              <div className="border-b border-border px-4 py-3 flex-shrink-0 bg-background">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="tasks" className="text-sm">AI Tasks</TabsTrigger>
                  <TabsTrigger value="prompt" className="text-sm">AI Visualization</TabsTrigger>
                  <TabsTrigger value="preview" className="text-sm">Chart Preview</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="tasks" className="m-0 h-full">
                <TaskInputPanel 
                  projectId={currentProjectId}
                  onGenerateChart={handleGenerateChart}
                />
              </TabsContent>

              <TabsContent value="prompt" className="m-0 h-full">
                <PromptGenerator onGenerateChart={handleGenerateChart} />
              </TabsContent>

              <TabsContent value="preview" className="m-0 h-full">
                <ChartPreviewPanel
                  mermaidCode={mermaidCode}
                  onUpdateChart={handleUpdateChart}
                  isGenerating={isGenerating}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Status Bar */}
          <div className="border-t border-border bg-muted px-4 py-2 flex-shrink-0">
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
              <span className="text-xs text-muted-foreground">
                NovaFlow AI Visualization
              </span>
            </div>
          </div>
        </main>

        {/* Quick Tips Widget */}
        <QuickTipsWidget 
          currentTab={currentTab}
          taskCount={taskCount}
          hasChart={!!mermaidCode}
        />
      </div>



      {/* Footer */}
      <footer className="fixed bottom-0 right-0 p-2 text-xs text-muted-foreground bg-background/80 backdrop-blur-sm">
        Created by Han
      </footer>
    </div>
  );
}