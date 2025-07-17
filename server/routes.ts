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
      const groqApiKey = process.env.GROQ_API_KEY?.trim();

      console.log('API Key length:', groqApiKey?.length);
      console.log('API Key starts with gsk_:', groqApiKey?.startsWith('gsk_'));

      if (!groqApiKey) {
        return res.status(500).json({ message: "Groq API key not configured. Please add GROQ_API_KEY to your environment variables." });
      }

      // Validate API key format
      if (!groqApiKey.startsWith('gsk_')) {
        return res.status(500).json({ message: "Invalid Groq API key format. Key should start with 'gsk_'." });
      }

      // Prepare the prompt for Groq - let AI decide the best visualization type
      const prompt = `Create a Mermaid.js visualization for the following project data:

Project Name: ${validatedData.projectName}
Visualization Style: ${validatedData.chartStyle || 'Auto-select best type'}
User Instructions: ${validatedData.instructions || 'Create the most appropriate visualization for this data'}

Project Data:
${validatedData.tasks.map((task, index) => 
  `${index + 1}. ${task.title}
     Start Date: ${task.startDate}
     End Date: ${task.endDate}
     Description: ${task.description || 'N/A'}`
).join('\n\n')}

Based on this data and user instructions, select the most appropriate Mermaid.js diagram type:
- If time-based project management: use gantt chart
- If process flow or workflow: use flowchart
- If hierarchical concepts: use mind map
- If showing relationships: use graph
- If showing states/transitions: use state diagram
- If user specified a particular type: use that type
- Any other Mermaid diagram type that fits the data

Generate clean, well-structured Mermaid.js code that best represents this information.`;

      // Get user preferences for model selection
      const userModel = req.body.groqModel || 'llama3-70b-8192';

      // Call Groq API
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${groqApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: userModel,
          messages: [
            {
              role: 'system',
              content: 'You are an expert in creating Mermaid.js visualizations. Generate ONLY clean, valid Mermaid.js code without any explanations, markdown formatting, or code blocks. Choose the best diagram type (gantt, flowchart, mindmap, timeline, state, graph, etc.) based on the data. Ensure proper syntax and formatting.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 3000,
          temperature: 0.1,
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

  // AI Prompt Generation
  app.post("/api/generate-from-prompt", async (req, res) => {
    try {
      const { prompt, chartType } = req.body;

      if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ message: "Prompt is required" });
      }

      // Get Groq API key from environment
      const groqApiKey = process.env.GROQ_API_KEY?.trim();

      console.log('Prompt API Key length:', groqApiKey?.length);
      console.log('Prompt API Key starts with gsk_:', groqApiKey?.startsWith('gsk_'));

      if (!groqApiKey) {
        return res.status(500).json({ message: "Groq API key not configured. Please add GROQ_API_KEY to your environment variables." });
      }

      // Validate API key format
      if (!groqApiKey.startsWith('gsk_')) {
        return res.status(500).json({ message: "Invalid Groq API key format. Key should start with 'gsk_'." });
      }

      // Enhanced prompt for better AI understanding
      const enhancedPrompt = `Create a Mermaid.js visualization based on this request:

USER REQUEST: ${prompt}

PREFERRED CHART TYPE: ${chartType || 'Auto-select best type'}

Please analyze the request and create the most appropriate Mermaid.js diagram. Consider:
- If it involves time/scheduling: use gantt chart
- If it shows processes/workflows: use flowchart
- If it shows concepts/ideas: use mind map
- If it shows states/transitions: use state diagram
- If it shows interactions: use sequence diagram
- If user specified a type: use that type

Generate clean, well-structured Mermaid.js code that accurately represents the user's request.
Include proper titles, labels, and structure.
Return only the Mermaid code without explanations.`;

      // Get user preferences for model selection
      const userModel = req.body.groqModel || 'llama3-70b-8192';

      // Call Groq API
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${groqApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: userModel,
          messages: [
            {
              role: 'system',
              content: 'You are an expert in creating Mermaid.js visualizations. Generate ONLY clean, valid Mermaid.js code without any explanations, markdown formatting, or code blocks. Choose the best diagram type based on the user request. Ensure proper syntax and formatting.'
            },
            {
              role: 'user',
              content: enhancedPrompt
            }
          ],
          max_tokens: 3000,
          temperature: 0.1,
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
      console.error('Error in generate-from-prompt endpoint:', error);

      // Provide fallback Mermaid code if API fails
      const fallbackCode = `flowchart TD
    A[User Request] --> B[Process Request]
    B --> C[Generate Output]
    C --> D[Display Result]

    style A fill:#f9f,stroke:#333,stroke-width:2px
    style D fill:#9f9,stroke:#333,stroke-width:2px`;

      res.json({ 
        mermaidCode: fallbackCode,
        warning: "Used fallback visualization due to API error"
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