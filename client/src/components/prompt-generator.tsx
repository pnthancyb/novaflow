import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Wand2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface PromptGeneratorProps {
  onGenerateChart: (mermaidCode: string) => void;
}

export function PromptGenerator({ onGenerateChart }: PromptGeneratorProps) {
  const [prompt, setPrompt] = useState("");
  const [chartType, setChartType] = useState("Auto-select best type");
  const { toast } = useToast();

  const generateFromPromptMutation = useMutation({
    mutationFn: async (data: { prompt: string; chartType: string }) => {
      const response = await apiRequest("POST", "/api/generate-from-prompt", data);
      return response.json();
    },
    onSuccess: (data) => {
      onGenerateChart(data.mermaidCode);
      toast({
        title: "Visualization Generated",
        description: "AI has created your visualization from the prompt!",
      });
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate visualization from prompt",
        variant: "destructive",
      });
    },
  });

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt Required",
        description: "Please enter a prompt describing what you want to visualize.",
        variant: "destructive",
      });
      return;
    }

    generateFromPromptMutation.mutate({
      prompt: prompt.trim(),
      chartType,
    });
  };

  const examplePrompts = [
    "Create a software development workflow from planning to deployment",
    "Show the hiring process from application to onboarding",
    "Visualize a marketing campaign timeline with key milestones",
    "Create a mind map for project management best practices",
    "Show the customer journey from awareness to purchase",
  ];

  return (
    <div className="p-6 overflow-y-auto custom-scrollbar">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">AI Prompt Generator</h1>
        <p className="text-muted-foreground">
          Describe what you want to visualize and let AI create the perfect chart
        </p>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="prompt">What do you want to visualize?</Label>
              <Textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your visualization: 'Create a project timeline for building a mobile app' or 'Show the customer support process as a flowchart'"
                rows={4}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Preferred Chart Type</Label>
              <Select value={chartType} onValueChange={setChartType}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Auto-select best type">Auto-select best type</SelectItem>
                  <SelectItem value="Gantt Chart">Gantt Chart</SelectItem>
                  <SelectItem value="Flowchart">Flowchart</SelectItem>
                  <SelectItem value="Mind Map">Mind Map</SelectItem>
                  <SelectItem value="Timeline">Timeline</SelectItem>
                  <SelectItem value="State Diagram">State Diagram</SelectItem>
                  <SelectItem value="Graph">Graph</SelectItem>
                  <SelectItem value="Sequence Diagram">Sequence Diagram</SelectItem>
                  <SelectItem value="User Journey">User Journey</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-3">Example Prompts</h3>
          <div className="space-y-2">
            {examplePrompts.map((example, index) => (
              <button
                key={index}
                onClick={() => setPrompt(example)}
                className="w-full text-left p-3 rounded-lg border border-border hover:bg-muted transition-colors text-sm"
              >
                <Wand2 className="w-4 h-4 inline mr-2 text-muted-foreground" />
                {example}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Button 
        onClick={handleGenerate}
        className="w-full"
        disabled={generateFromPromptMutation.isPending}
      >
        <Sparkles className="w-4 h-4 mr-2" />
        {generateFromPromptMutation.isPending ? "AI is creating..." : "Generate Visualization"}
      </Button>
    </div>
  );
}