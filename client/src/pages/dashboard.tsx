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

export default function Dashboard() {
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

  const handleSelectTemplate = (template: any) => {
    setMermaidCode(template.schema);
    setShowChart(true);
  };

  const exportToPNG = () => {
    // Get the SVG element from the rendered chart
    const svgElement = document.querySelector('.mermaid-chart svg') as SVGElement;
    if (!svgElement) return;

    // Create a high-quality canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Get SVG dimensions
    const svgRect = svgElement.getBoundingClientRect();
    const scale = 2; // Higher resolution for better quality
    
    canvas.width = svgRect.width * scale;
    canvas.height = svgRect.height * scale;
    
    // Scale the context for high DPI
    ctx.scale(scale, scale);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const data = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([data], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, svgRect.width, svgRect.height);
      
      // Download the canvas as PNG with high quality
      canvas.toBlob((blob) => {
        if (blob) {
          const link = document.createElement('a');
          link.download = 'novaflow-chart.png';
          link.href = URL.createObjectURL(blob);
          link.click();
        }
      }, 'image/png', 1.0);
      
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onSelectProject={handleSelectProject}
        onSelectTemplate={handleSelectTemplate}
      />
      
      <div className="flex h-screen pt-16">
        <Sidebar />
        
        <main className="flex-1 flex flex-col">
          <div className="flex-1 flex">
            <div className="flex-1">
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
                  {isGenerating ? 'AI is creating visualization...' : 
                   mermaidCode ? 'Visualization ready' : 'No visualization generated'}
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
                  Preview
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={exportToPNG}
                  disabled={!mermaidCode}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export PNG
                </Button>
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
