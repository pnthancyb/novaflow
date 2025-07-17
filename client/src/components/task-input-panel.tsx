import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, GripVertical, Sparkles } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Task, Project } from "@shared/schema";

interface TaskInputPanelProps {
  projectId: number;
  onGenerateChart: (mermaidCode: string) => void;
}

interface TaskInput {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
}

export function TaskInputPanel({ projectId, onGenerateChart }: TaskInputPanelProps) {
  const [tasks, setTasks] = useState<TaskInput[]>([]);
  const [projectName, setProjectName] = useState("");
  const [projectStartDate, setProjectStartDate] = useState("");
  const [chartStyle, setChartStyle] = useState("Auto-select best type");
  const [additionalInstructions, setAdditionalInstructions] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch project data
  const { data: project } = useQuery({
    queryKey: [`/api/projects/${projectId}`],
    enabled: !!projectId,
  });

  // Fetch tasks
  const { data: tasksData } = useQuery({
    queryKey: [`/api/projects/${projectId}/tasks`],
    enabled: !!projectId,
  });

  // Update local state when data loads
  useEffect(() => {
    if (project) {
      setProjectName(project.name || "");
      setProjectStartDate(project.startDate || "");
    }
  }, [project]);

  useEffect(() => {
    if (tasksData) {
      setTasks(tasksData.map((task: Task) => ({
        title: task.title,
        description: task.description || "",
        startDate: task.startDate,
        endDate: task.endDate,
      })));
    }
  }, [tasksData]);

  // Mutations
  const saveTaskMutation = useMutation({
    mutationFn: async (task: TaskInput & { id?: number }) => {
      const method = task.id ? "PATCH" : "POST";
      const url = task.id ? `/api/tasks/${task.id}` : `/api/projects/${projectId}/tasks`;
      const response = await apiRequest(method, url, task);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${projectId}/tasks`] });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId: number) => {
      const response = await apiRequest("DELETE", `/api/tasks/${taskId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${projectId}/tasks`] });
    },
  });

  const generateMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/generate-gantt", data);
      return response.json();
    },
    onSuccess: (data) => {
      onGenerateChart(data.mermaidCode);
      toast({
        title: "Chart Generated",
        description: "AI has created your visualization! Switch to Chart Preview tab to see it.",
      });
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate chart",
        variant: "destructive",
      });
    },
  });

  const addTask = () => {
    const newTask: TaskInput = {
      title: `Task ${tasks.length + 1}`,
      description: "",
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (index: number, field: keyof TaskInput, value: string) => {
    const updatedTasks = tasks.map((task, i) => 
      i === index ? { ...task, [field]: value } : task
    );
    setTasks(updatedTasks);
  };

  const deleteTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const saveTask = (task: TaskInput) => {
    saveTaskMutation.mutate({
      ...task,
      projectId,
    });
  };

  const handleGenerateChart = () => {
    if (tasks.length === 0) {
      toast({
        title: "No Tasks",
        description: "Please add at least one task to generate a chart.",
        variant: "destructive",
      });
      return;
    }

    generateMutation.mutate({
      projectName,
      tasks,
      chartStyle,
      additionalInstructions,
    });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0 p-4 border-b border-border bg-background">
        <h1 className="text-xl font-bold mb-1">AI Tasks</h1>
        <p className="text-sm text-muted-foreground">Add tasks and project details for AI to create visualizations</p>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
        {/* Project Info */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-4">Project Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="project-name">Project Name</Label>
                <Input
                  id="project-name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Enter project name"
                  className="mt-1 h-9"
                />
              </div>
              <div>
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={projectStartDate}
                  onChange={(e) => setProjectStartDate(e.target.value)}
                  className="mt-1 h-9"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tasks */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Project Tasks</h3>
              <Button onClick={addTask} size="sm" className="h-9 px-4">
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
              {tasks.map((task, index) => (
                <div key={index} className="border border-border rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2 flex-1">
                      <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                      <Input
                        value={task.title}
                        onChange={(e) => updateTask(index, 'title', e.target.value)}
                        onBlur={() => saveTask(task)}
                        className="font-medium border-none bg-transparent p-0 h-auto text-base"
                        placeholder="Task title..."
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteTask(index)}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <Label className="text-sm text-muted-foreground mb-1 block">Start Date</Label>
                      <Input
                        type="date"
                        value={task.startDate}
                        onChange={(e) => updateTask(index, 'startDate', e.target.value)}
                        onBlur={() => saveTask(task)}
                        className="h-9"
                      />
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground mb-1 block">End Date</Label>
                      <Input
                        type="date"
                        value={task.endDate}
                        onChange={(e) => updateTask(index, 'endDate', e.target.value)}
                        onBlur={() => saveTask(task)}
                        className="h-9"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground mb-1 block">Description</Label>
                    <Textarea
                      value={task.description}
                      onChange={(e) => updateTask(index, 'description', e.target.value)}
                      onBlur={() => saveTask(task)}
                      placeholder="Task description..."
                      rows={2}
                      className="resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Generation Settings */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-4">AI Visualization Settings</h3>
            <div className="space-y-4">
              <div>
                <Label>Visualization Type</Label>
                <Select value={chartStyle} onValueChange={setChartStyle}>
                  <SelectTrigger className="mt-1">
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
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Instructions for AI</Label>
                <Textarea
                  value={additionalInstructions}
                  onChange={(e) => setAdditionalInstructions(e.target.value)}
                  placeholder="Tell AI how to visualize your data: 'Show as a process flow', 'Create a mind map', 'Focus on dependencies', etc."
                  rows={3}
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Generate Button - Fixed at bottom */}
      <div className="flex-shrink-0 p-4 border-t border-border bg-background">
        <Button 
          onClick={handleGenerateChart}
          className="w-full h-12"
          disabled={generateMutation.isPending}
          size="lg"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          {generateMutation.isPending ? "AI is creating..." : "Generate Chart with AI"}
        </Button>
      </div>
    </div>
  );
}