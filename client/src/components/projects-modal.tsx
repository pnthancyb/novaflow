import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FolderOpen, Plus, Search, Calendar, BarChart3, FileText, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface Project {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  taskCount: number;
  chartCount: number;
  status: "active" | "completed" | "archived";
}

interface ProjectsModalProps {
  onSelectProject: (project: Project) => void;
}

export function ProjectsModal({ onSelectProject }: ProjectsModalProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newProject, setNewProject] = useState({ name: "", description: "" });
  const [activeTab, setActiveTab] = useState("browse");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch projects from API
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["/api/projects"],
    enabled: open,
  });

  // Create new project mutation
  const createProjectMutation = useMutation({
    mutationFn: async (projectData: { name: string; description: string }) => {
      const response = await apiRequest("POST", "/api/projects", projectData);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      setNewProject({ name: "", description: "" });
      setActiveTab("browse");
      toast({
        title: "Project Created",
        description: `${data.name} has been created successfully.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create project",
        variant: "destructive",
      });
    },
  });

  // Delete project mutation
  const deleteProjectMutation = useMutation({
    mutationFn: async (projectId: number) => {
      await apiRequest("DELETE", `/api/projects/${projectId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Project Deleted",
        description: "Project has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Deletion Failed",
        description: error.message || "Failed to delete project",
        variant: "destructive",
      });
    },
  });

  const handleCreateProject = () => {
    if (!newProject.name.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter a project name.",
        variant: "destructive",
      });
      return;
    }
    createProjectMutation.mutate(newProject);
  };

  const handleSelectProject = (project: Project) => {
    onSelectProject(project);
    setOpen(false);
    toast({
      title: "Project Selected",
      description: `Now working on ${project.name}`,
    });
  };

  const handleDeleteProject = (projectId: number, projectName: string) => {
    if (window.confirm(`Are you sure you want to delete "${projectName}"? This action cannot be undone.`)) {
      deleteProjectMutation.mutate(projectId);
    }
  };

  const filteredProjects = projects.filter((project: Project) =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "completed": return "bg-blue-100 text-blue-800";
      case "archived": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <FolderOpen className="w-4 h-4 mr-2" />
          Projects
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Project Management</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="browse">Browse Projects</TabsTrigger>
            <TabsTrigger value="create">Create New</TabsTrigger>
          </TabsList>
          
          <TabsContent value="browse" className="space-y-4">
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
            </div>
            
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
              </div>
            ) : filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredProjects.map((project: Project) => (
                  <Card key={project.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{project.name}</CardTitle>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(project.status)}>
                            {project.status}
                          </Badge>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteProject(project.id, project.name)}
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{project.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <FileText className="w-4 h-4" />
                            <span>{project.taskCount || 0} tasks</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <BarChart3 className="w-4 h-4" />
                            <span>{project.chartCount || 0} charts</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(project.updatedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <Button 
                        onClick={() => handleSelectProject(project)}
                        className="w-full"
                      >
                        Open Project
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FolderOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No projects found</p>
                <p className="text-sm mt-1">Create your first project to get started</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="create" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="w-5 h-5 mr-2" />
                  Create New Project
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="project-name">Project Name</Label>
                  <Input
                    id="project-name"
                    placeholder="Enter project name..."
                    value={newProject.name}
                    onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="project-description">Description</Label>
                  <Textarea
                    id="project-description"
                    placeholder="Describe your project..."
                    value={newProject.description}
                    onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                    rows={3}
                  />
                </div>
                
                <Button 
                  onClick={handleCreateProject}
                  disabled={createProjectMutation.isPending}
                  className="w-full"
                >
                  {createProjectMutation.isPending ? "Creating..." : "Create Project"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}