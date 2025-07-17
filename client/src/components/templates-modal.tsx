import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, BarChart3, GitBranch, Brain, Clock, Users, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ComponentType<any>;
  schema: string;
  tags: string[];
}

const templates: Template[] = [
  {
    id: "software-dev",
    name: "Software Development Workflow",
    description: "Complete software development lifecycle from planning to deployment",
    category: "Development",
    icon: GitBranch,
    tags: ["Development", "Workflow", "Agile"],
    schema: `flowchart TD
    A[Requirements Gathering] --> B[Design & Architecture]
    B --> C[Development]
    C --> D[Testing]
    D --> E[Code Review]
    E --> F[Deployment]
    F --> G[Monitoring]
    G --> H[Maintenance]
    
    C --> I[Unit Testing]
    I --> C
    D --> J[Integration Testing]
    J --> K[User Testing]
    K --> L[Bug Fixes]
    L --> D
    
    style A fill:#e1f5fe
    style F fill:#c8e6c9
    style G fill:#fff3e0`
  },
  {
    id: "project-gantt",
    name: "Project Management Gantt",
    description: "Standard project timeline with tasks and dependencies",
    category: "Project Management",
    icon: BarChart3,
    tags: ["Gantt", "Timeline", "Project"],
    schema: `gantt
    title Project Timeline
    dateFormat  YYYY-MM-DD
    section Planning
    Requirements Analysis    :a1, 2024-01-01, 7d
    Design Phase            :a2, after a1, 10d
    section Development
    Backend Development     :b1, 2024-01-15, 14d
    Frontend Development    :b2, 2024-01-20, 12d
    Integration             :b3, after b1 b2, 5d
    section Testing
    Unit Testing           :c1, after b3, 7d
    System Testing         :c2, after c1, 5d
    User Testing           :c3, after c2, 3d
    section Deployment
    Production Deploy      :d1, after c3, 2d
    Go Live               :d2, after d1, 1d`
  },
  {
    id: "mind-map",
    name: "Brainstorming Mind Map",
    description: "Hierarchical mind map for idea organization",
    category: "Planning",
    icon: Brain,
    tags: ["Mind Map", "Brainstorming", "Ideas"],
    schema: `mindmap
  root((Project Ideas))
    Features
      User Authentication
        Login/Logout
        Social Login
        Password Reset
      Dashboard
        Analytics
        Reports
        Settings
      Mobile App
        iOS
        Android
        React Native
    Technology
      Frontend
        React
        Vue
        Angular
      Backend
        Node.js
        Python
        Java
      Database
        PostgreSQL
        MongoDB
        Redis
    Timeline
      Phase 1
        MVP
        Core Features
      Phase 2
        Advanced Features
        Mobile App
      Phase 3
        Scaling
        Analytics`
  },
  {
    id: "user-journey",
    name: "User Journey Map",
    description: "Customer experience journey from awareness to advocacy",
    category: "UX/UI",
    icon: Users,
    tags: ["UX", "Journey", "Customer"],
    schema: `journey
    title User Journey
    section Discovery
      Awareness          : 3: User, Marketing
      Research           : 4: User
      Comparison         : 3: User, Competitors
    section Consideration
      Sign Up            : 5: User
      Onboarding         : 4: User, Support
      First Use          : 3: User
    section Purchase
      Free Trial         : 4: User
      Upgrade Decision   : 3: User, Sales
      Payment            : 5: User
    section Retention
      Regular Use        : 4: User
      Feature Discovery  : 3: User, Product
      Support            : 4: User, Support
    section Advocacy
      Referral           : 5: User
      Review             : 4: User
      Case Study         : 3: User, Marketing`
  },
  {
    id: "state-diagram",
    name: "System State Diagram",
    description: "State transitions for system or application logic",
    category: "Development",
    icon: GitBranch,
    tags: ["State", "Logic", "System"],
    schema: `stateDiagram-v2
    [*] --> Idle
    Idle --> Loading : Start Process
    Loading --> Success : Process Complete
    Loading --> Error : Process Failed
    Success --> Idle : Reset
    Error --> Retry : Retry Action
    Retry --> Loading : Retry Process
    Error --> Idle : Cancel
    Success --> [*]
    
    state Loading {
        [*] --> Validating
        Validating --> Processing
        Processing --> Finalizing
        Finalizing --> [*]
    }
    
    state Error {
        [*] --> ValidationError
        [*] --> ProcessingError
        [*] --> NetworkError
        ValidationError --> [*]
        ProcessingError --> [*]
        NetworkError --> [*]
    }`
  },
  {
    id: "timeline",
    name: "Product Timeline",
    description: "Product development and launch timeline",
    category: "Product",
    icon: Clock,
    tags: ["Timeline", "Product", "Launch"],
    schema: `timeline
    title Product Development Timeline
    
    section Q1 2024
        Research & Planning : Market Research
                           : Competitive Analysis
                           : Feature Planning
    
    section Q2 2024
        Design & Prototyping : UI/UX Design
                            : Prototype Development
                            : User Testing
    
    section Q3 2024
        Development : Backend Development
                   : Frontend Development
                   : API Integration
    
    section Q4 2024
        Testing & Launch : Quality Assurance
                        : Beta Testing
                        : Production Launch
                        : Marketing Campaign`
  }
];

interface TemplatesModalProps {
  onSelectTemplate: (template: Template) => void;
}

export function TemplatesModal({ onSelectTemplate }: TemplatesModalProps) {
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { toast } = useToast();

  const categories = ["all", ...Array.from(new Set(templates.map(t => t.category)))];
  const filteredTemplates = selectedCategory === "all" 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  const handleSelectTemplate = (template: Template) => {
    onSelectTemplate(template);
    setOpen(false);
    toast({
      title: "Template Applied",
      description: `${template.name} template has been applied to your project.`,
    });
  };

  const copyToClipboard = (schema: string) => {
    navigator.clipboard.writeText(schema);
    toast({
      title: "Schema Copied",
      description: "Template schema has been copied to clipboard.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <FileText className="w-4 h-4 mr-2" />
          Templates
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chart Templates</DialogTitle>
        </DialogHeader>
        
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="Development">Development</TabsTrigger>
            <TabsTrigger value="Project Management">Project</TabsTrigger>
            <TabsTrigger value="Planning">Planning</TabsTrigger>
            <TabsTrigger value="UX/UI">UX/UI</TabsTrigger>
            <TabsTrigger value="Product">Product</TabsTrigger>
          </TabsList>
          
          <TabsContent value={selectedCategory} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTemplates.map((template) => {
                const IconComponent = template.icon;
                return (
                  <Card key={template.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center text-lg">
                          <IconComponent className="w-5 h-5 mr-2" />
                          {template.name}
                        </CardTitle>
                        <Badge variant="secondary">{template.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {template.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleSelectTemplate(template)}
                          className="flex-1"
                        >
                          Use Template
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => copyToClipboard(template.schema)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}