import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, GripVertical, Trash2, Sparkles } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Task, Project } from "@shared/schema";

interface TaskInputPanelProps {
  projectId: number;
  onGenerateChart: (mermaidCode: string) => void;
}

interface TaskData {
  id?: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  order: number;
}

export function TaskInputPanel({ projectId, onGenerateChart }: TaskInputPanelProps) {
  const [projectName, setProjectName] = useState("");
  const [projectStartDate, setProjectStartDate] = useState("");
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [chartStyle, setChartStyle] = useState("Auto-select best type");
  const [additionalInstructions, setAdditionalInstructions] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch project data
  const { data: project } = useQuery<Project>({
    queryKey: ["/api/projects", projectId],
    enabled: !!projectId,
  });

  // Fetch tasks
  const { data: fetchedTasks } = useQuery<Task[]>({
    queryKey: ["/api/projects", projectId, "tasks"],
    enabled: !!projectId,
  });

  // Update local state when data is fetched
  useEffect(() => {
    if (project) {
      setProjectName(project.name);
      setProjectStartDate(project.startDate || "");
    }
  }, [project]);

  useEffect(() => {
    if (fetchedTasks) {
      setTasks(fetchedTasks.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description || "",
        startDate: task.startDate || "",
        endDate: task.endDate || "",
        order: task.order || 0,
      })));
    }
  }, [fetchedTasks]);

  // Mutations
  const createTaskMutation = useMutation({
    mutationFn: async (task: Omit<TaskData, 'id'>) => {
      const response = await apiRequest("POST", `/api/projects/${projectId}/tasks`, task);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "tasks"] });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, ...task }: TaskData) => {
      const response = await apiRequest("PUT", `/api/tasks/${id}`, task);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "tasks"] });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId: number) => {
      await apiRequest("DELETE", `/api/tasks/${taskId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "tasks"] });
    },
  });

  const generateGanttMutation = useMutation({
    mutationFn: async (data: {
      projectName: string;
      tasks: Array<{
        title: string;
        startDate: string;
        endDate: string;
        description?: string;
      }>;
      instructions?: string;
      chartStyle?: string;
      groqModel?: string;
    }) => {
      const response = await apiRequest("POST", "/api/generate-gantt", data);
      return response.json();
    },
    onSuccess: (data) => {
      onGenerateChart(data.mermaidCode);
      toast({
        title: "Visualization Generated",
        description: "AI has created your visualization successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate visualization",
        variant: "destructive",
      });
    },
  });

  const addTask = () => {
    const newTask: TaskData = {
      title: "New Task",
      description: "",
      startDate: "",
      endDate: "",
      order: tasks.length,
    };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (index: number, field: keyof TaskData, value: string | number) => {
    const updatedTasks = [...tasks];
    updatedTasks[index] = { ...updatedTasks[index], [field]: value };
    setTasks(updatedTasks);

    // If task has an ID, update it in the database
    if (updatedTasks[index].id) {
      updateTaskMutation.mutate(updatedTasks[index]);
    }
  };

  const deleteTask = (index: number) => {
    const task = tasks[index];
    if (task.id) {
      deleteTaskMutation.mutate(task.id);
    }
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const saveTask = (task: TaskData) => {
    if (task.id) {
      updateTaskMutation.mutate(task);
    } else {
      createTaskMutation.mutate(task);
    }
  };

  const generateGanttChart = () => {
    if (!projectName.trim()) {
      toast({
        title: "Project Name Required",
        description: "Please enter a project name before generating the visualization.",
        variant: "destructive",
      });
      return;
    }

    if (tasks.length === 0) {
      toast({
        title: "No Tasks",
        description: "Please add at least one task before generating the visualization.",
        variant: "destructive",
      });
      return;
    }

    // Get user preferences
    const preferences = JSON.parse(localStorage.getItem("novaflow-preferences") || "{}");
    const selectedModel = preferences.groqModel || "llama3-70b-8192";

    generateGanttMutation.mutate({
      projectName,
      tasks: tasks.map(task => ({
        title: task.title,
        startDate: task.startDate,
        endDate: task.endDate,
        description: task.description,
      })),
      instructions: additionalInstructions,
      chartStyle,
      groqModel: selectedModel,
    });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0 p-4 border-b border-border bg-background">
        <h1 className="text-xl font-bold mb-1">AI Visualization Builder</h1>
        <p className="text-sm text-muted-foreground">Add your project data and let AI create the perfect visualization</p>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">

        {/* Project Settings */}
        <Card className="mb-4 lg:mb-6">
          <CardContent className="pt-4 lg:pt-6">
            <h3 className="font-semibold mb-3 text-sm lg:text-base">Project Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="project-name" className="text-sm">Project Name</Label>
                <Input
                  id="project-name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Enter project name"
                  className="text-sm"
                />
              </div>
              <div>
                <Label htmlFor="start-date" className="text-sm">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={projectStartDate}
                  onChange={(e) => setProjectStartDate(e.target.value)}
                  className="text-sm"
                />
              </div>
            </div>
          </CardContent>
        </Card>

      {/* Tasks */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Tasks</h3>
          <Button onClick={addTask} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>

        <div className="space-y-3">
          {tasks.map((task, index) => (
            <Card key={index} className="hover:shadow-sm transition-shadow">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2 flex-1">
                    <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                    <Input
                      value={task.title}
                      onChange={(e) => updateTask(index, 'title', e.target.value)}
                      onBlur={() => saveTask(task)}
                      className="font-medium border-none bg-transparent p-0 h-auto"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteTask(index)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-2">
                  <div>
                    <Label className="text-xs text-muted-foreground">Start Date</Label>
                    <Input
                      type="date"
                      value={task.startDate}
                      onChange={(e) => updateTask(index, 'startDate', e.target.value)}
                      onBlur={() => saveTask(task)}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">End Date</Label>
                    <Input
                      type="date"
                      value={task.endDate}
                      onChange={(e) => updateTask(index, 'endDate', e.target.value)}
                      onBlur={() => saveTask(task)}
                      className="text-sm"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Description</Label>
                  <Textarea
                    value={task.description}
                    onChange={(e) => updateTask(index, 'description', e.target.value)}
                    onBlur={() => saveTask(task)}
                    placeholder="Task description..."
                    className="text-sm resize-none"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* AI Generation Settings */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-3">AI Visualization Settings</h3>
          <div className="space-y-3">
            <div>
              <Label>Visualization Type</Label>
              <Select value={chartStyle} onValueChange={setChartStyle}>
                <SelectTrigger>
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
              />
            </div>
          </div>
        </CardContent>
      </Card>

      </div>

      {/* Generate Button - Fixed at bottom */}
      <div className="flex-shrink-0 p-4 border-t border-border bg-background">
        <Button 
          onClick={generateGanttChart}
          className="w-full h-12"
          disabled={generateGanttMutation.isPending}
          size="lg"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          {generateGanttMutation.isPending ? "AI is creating..." : "Generate Visualization with AI"}
        </Button>
      </div>
    </div>
  );
}