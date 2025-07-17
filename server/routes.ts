import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProjectSchema, insertTaskSchema, insertChartSchema } from "@shared/schema";
import { z } from "zod";

const generateGanttSchema = z.object({
  projectName: z.string(),
  tasks: z.array(z.object({
    title: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    description: z.string().optional(),
  })),
  instructions: z.string().optional(),
  chartStyle: z.string().optional(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Projects
  app.get("/api/projects", async (req, res) => {
    try {
      // For demo purposes, assume userId = 1
      const projects = await storage.getProjectsByUserId(1);
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.getProject(parseInt(req.params.id));
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const validatedData = insertProjectSchema.parse({ ...req.body, userId: 1 });
      const project = await storage.createProject(validatedData);
      res.status(201).json(project);
    } catch (error) {
      res.status(400).json({ message: "Invalid project data" });
    }
  });

  app.put("/api/projects/:id", async (req, res) => {
    try {
      const validatedData = insertProjectSchema.partial().parse(req.body);
      const project = await storage.updateProject(parseInt(req.params.id), validatedData);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(400).json({ message: "Invalid project data" });
    }
  });

  app.delete("/api/projects/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteProject(parseInt(req.params.id));
      if (!deleted) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  // Tasks
  app.get("/api/projects/:projectId/tasks", async (req, res) => {
    try {
      const tasks = await storage.getTasksByProjectId(parseInt(req.params.projectId));
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  app.post("/api/projects/:projectId/tasks", async (req, res) => {
    try {
      const validatedData = insertTaskSchema.parse({
        ...req.body,
        projectId: parseInt(req.params.projectId),
      });
      const task = await storage.createTask(validatedData);
      res.status(201).json(task);
    } catch (error) {
      res.status(400).json({ message: "Invalid task data" });
    }
  });

  app.put("/api/tasks/:id", async (req, res) => {
    try {
      const validatedData = insertTaskSchema.partial().parse(req.body);
      const task = await storage.updateTask(parseInt(req.params.id), validatedData);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      res.status(400).json({ message: "Invalid task data" });
    }
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteTask(parseInt(req.params.id));
      if (!deleted) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete task" });
    }
  });

  // Groq AI Gantt Generation
  app.post("/api/generate-gantt", async (req, res) => {
    try {
      const validatedData = generateGanttSchema.parse(req.body);
      
      // Get Groq API key from environment
      const groqApiKey = process.env.GROQ_API_KEY;
      
      if (!groqApiKey) {
        return res.status(500).json({ message: "Groq API key not configured. Please add GROQ_API_KEY to your environment variables." });
      }

      // Prepare the prompt for Groq
      const prompt = `Generate a Mermaid.js Gantt chart for the following project:

Project Name: ${validatedData.projectName}
Chart Style: ${validatedData.chartStyle || 'Standard Gantt'}
Additional Instructions: ${validatedData.instructions || 'None'}

Tasks:
${validatedData.tasks.map((task, index) => 
  `${index + 1}. ${task.title}
     Start Date: ${task.startDate}
     End Date: ${task.endDate}
     Description: ${task.description || 'N/A'}`
).join('\n\n')}

Please generate a complete Mermaid.js Gantt chart code that includes:
1. A proper title
2. Date format specification
3. All tasks with proper date ranges
4. Clean syntax

Return only the Mermaid.js code without any explanations or markdown formatting.`;

      // Call Groq API
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${groqApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'mixtral-8x7b-32768',
          messages: [
            {
              role: 'system',
              content: 'You are an expert in project management and Mermaid.js. Generate clean, well-structured Gantt charts using proper Mermaid syntax. Return only the Mermaid code without any explanations or markdown formatting.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 2048,
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Groq API Response:', response.status, errorText);
        throw new Error(`Groq API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      let mermaidCode = data.choices[0]?.message?.content?.trim() || '';

      if (!mermaidCode) {
        throw new Error('No Mermaid code generated from API response');
      }

      // Clean up markdown code blocks if present
      mermaidCode = mermaidCode.replace(/^```[\w]*\n?/, '').replace(/\n?```$/, '').trim();

      res.json({ mermaidCode });
    } catch (error) {
      console.error('Error in generate-gantt endpoint:', error);
      
      // Provide fallback Mermaid code if API fails
      const fallbackCode = `gantt
    title ${req.body.projectName || 'Project Gantt Chart'}
    dateFormat YYYY-MM-DD
    
    ${req.body.tasks?.map((task: any, index: number) => 
      `task${index + 1} : ${task.title} : ${task.startDate}, ${task.endDate}`
    ).join('\n    ') || 'No tasks defined'}`;
      
      res.json({ 
        mermaidCode: fallbackCode,
        warning: "Used fallback chart generation due to API error"
      });
    }
  });

  // Charts
  app.get("/api/projects/:projectId/charts", async (req, res) => {
    try {
      const charts = await storage.getChartsByProjectId(parseInt(req.params.projectId));
      res.json(charts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch charts" });
    }
  });

  app.post("/api/projects/:projectId/charts", async (req, res) => {
    try {
      const validatedData = insertChartSchema.parse({
        ...req.body,
        projectId: parseInt(req.params.projectId),
      });
      const chart = await storage.createChart(validatedData);
      res.status(201).json(chart);
    } catch (error) {
      res.status(400).json({ message: "Invalid chart data" });
    }
  });

  app.put("/api/charts/:id", async (req, res) => {
    try {
      const validatedData = insertChartSchema.partial().parse(req.body);
      const chart = await storage.updateChart(parseInt(req.params.id), validatedData);
      if (!chart) {
        return res.status(404).json({ message: "Chart not found" });
      }
      res.json(chart);
    } catch (error) {
      res.status(400).json({ message: "Invalid chart data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
