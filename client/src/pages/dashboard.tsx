import { useState } from "react";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { TaskInputPanel } from "@/components/task-input-panel";
import { PromptGenerator } from "@/components/prompt-generator";
import { ChartDisplayPanel } from "@/components/chart-display-panel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Dashboard() {
  const [currentProjectId] = useState(1); // Mock project ID for demo
  const [mermaidCode, setMermaidCode] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex h-screen pt-16">
        <Sidebar />
        
        <main className="flex-1 flex">
          <div className="w-1/2">
            <Tabs defaultValue="structured" className="h-full">
              <div className="border-b border-border px-6 py-2">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="structured">Structured Input</TabsTrigger>
                  <TabsTrigger value="prompt">AI Prompt</TabsTrigger>
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
          
          <ChartDisplayPanel 
            mermaidCode={mermaidCode}
            onUpdateChart={handleUpdateChart}
            isGenerating={isGenerating}
          />
        </main>
      </div>
    </div>
  );
}
