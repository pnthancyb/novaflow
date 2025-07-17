
import { useState } from "react";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { TaskInputPanel } from "@/components/task-input-panel";
import { PromptGenerator } from "@/components/prompt-generator";
import { ChartDisplayPanel } from "@/components/chart-display-panel";
import { ChartPreviewPanel } from "@/components/chart-preview-panel";
import { QuickTipsWidget } from "@/components/quick-tips-widget";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "@/hooks/use-translation";
import { useQuery } from "@tanstack/react-query";

export default function Dashboard() {
  const { t } = useTranslation();
  const [currentProjectId] = useState(1);
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
      // Auto-switch to preview tab after generation
      setCurrentTab("preview");
    }, 1000);
  };

  const handleUpdateChart = (code: string) => {
    setMermaidCode(code);
  };

  const handleSelectProject = (project: any) => {
    console.log("Selected project:", project);
  };

  const handleApplyTemplate = (template: any) => {
    setMermaidCode(template.schema);
    if (template.prompt) {
      sessionStorage.setItem('templatePrompt', template.prompt);
      window.dispatchEvent(new CustomEvent('templateApplied', { detail: template }));
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
              <div className="border-b border-border px-6 py-4 flex-shrink-0 bg-background">
                <TabsList className="grid w-full grid-cols-3 h-12">
                  <TabsTrigger value="tasks" className="text-base font-medium h-10">
                    AI Görevler
                  </TabsTrigger>
                  <TabsTrigger value="prompt" className="text-base font-medium h-10">
                    AI Görselleştirme
                  </TabsTrigger>
                  <TabsTrigger value="preview" className="text-base font-medium h-10">
                    Önizleme
                  </TabsTrigger>
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
          <div className="border-t border-border bg-muted px-6 py-3 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  isGenerating ? 'bg-yellow-500 animate-pulse' : 
                  mermaidCode ? 'bg-green-500' : 'bg-gray-400'
                }`} />
                <span className="text-sm font-medium">
                  {isGenerating ? 'AI oluşturuyor...' : 
                   mermaidCode ? 'Hazır' : 'Görselleştirme yok'}
                </span>
              </div>
              <span className="text-sm text-muted-foreground font-medium">
                NovaFlow AI Görselleştirme
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
      <footer className="fixed bottom-0 right-0 p-3 text-sm text-muted-foreground bg-background/90 backdrop-blur-sm">
        Created by Han
      </footer>
    </div>
  );
}
