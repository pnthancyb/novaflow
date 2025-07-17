import { useState } from "react";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { TaskInputPanel } from "@/components/task-input-panel";
import { ChartDisplayPanel } from "@/components/chart-display-panel";

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
          <TaskInputPanel 
            projectId={currentProjectId}
            onGenerateChart={handleGenerateChart}
          />
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
