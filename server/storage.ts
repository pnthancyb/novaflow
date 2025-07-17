import { users, projects, tasks, charts, type User, type InsertUser, type Project, type InsertProject, type Task, type InsertTask, type Chart, type InsertChart } from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Project methods
  getProject(id: number): Promise<Project | undefined>;
  getProjectsByUserId(userId: number): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;
  
  // Task methods
  getTask(id: number): Promise<Task | undefined>;
  getTasksByProjectId(projectId: number): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, task: Partial<InsertTask>): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;
  updateTaskOrder(taskId: number, newOrder: number): Promise<void>;
  
  // Chart methods
  getChart(id: number): Promise<Chart | undefined>;
  getChartsByProjectId(projectId: number): Promise<Chart[]>;
  createChart(chart: InsertChart): Promise<Chart>;
  updateChart(id: number, chart: Partial<InsertChart>): Promise<Chart | undefined>;
  deleteChart(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private projects: Map<number, Project>;
  private tasks: Map<number, Task>;
  private charts: Map<number, Chart>;
  private currentUserId: number;
  private currentProjectId: number;
  private currentTaskId: number;
  private currentChartId: number;

  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.tasks = new Map();
    this.charts = new Map();
    this.currentUserId = 1;
    this.currentProjectId = 1;
    this.currentTaskId = 1;
    this.currentChartId = 1;
    
    // Create default project for demo
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Create a default project
    const defaultProject: Project = {
      id: 1,
      name: "NovaFlow Demo Project",
      description: "A sample project to demonstrate NovaFlow's Gantt chart generation",
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      userId: 1,
      createdAt: new Date()
    };
    this.projects.set(1, defaultProject);
    this.currentProjectId = 2;
    
    // Add some sample tasks
    const sampleTasks: Task[] = [
      {
        id: 1,
        projectId: 1,
        title: "Project Planning",
        description: "Define project scope and requirements",
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        order: 0
      },
      {
        id: 2,
        projectId: 1,
        title: "Design Phase",
        description: "Create wireframes and mockups",
        startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        order: 1
      },
      {
        id: 3,
        projectId: 1,
        title: "Development",
        description: "Build the application features",
        startDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        order: 2
      }
    ];
    
    sampleTasks.forEach(task => {
      this.tasks.set(task.id, task);
    });
    this.currentTaskId = 4;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getProjectsByUserId(userId: number): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(
      (project) => project.userId === userId,
    );
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.currentProjectId++;
    const project: Project = { 
      ...insertProject, 
      id, 
      createdAt: new Date(),
      startDate: insertProject.startDate || null,
      endDate: insertProject.endDate || null,
      description: insertProject.description || null,
      userId: insertProject.userId || null
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: number, updateData: Partial<InsertProject>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;
    
    const updated = { ...project, ...updateData };
    this.projects.set(id, updated);
    return updated;
  }

  async deleteProject(id: number): Promise<boolean> {
    return this.projects.delete(id);
  }

  async getTask(id: number): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async getTasksByProjectId(projectId: number): Promise<Task[]> {
    return Array.from(this.tasks.values())
      .filter((task) => task.projectId === projectId)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = this.currentTaskId++;
    const task: Task = { 
      ...insertTask, 
      id,
      projectId: insertTask.projectId || null,
      startDate: insertTask.startDate || null,
      endDate: insertTask.endDate || null,
      description: insertTask.description || null,
      order: insertTask.order || null
    };
    this.tasks.set(id, task);
    return task;
  }

  async updateTask(id: number, updateData: Partial<InsertTask>): Promise<Task | undefined> {
    const task = this.tasks.get(id);
    if (!task) return undefined;
    
    const updated = { ...task, ...updateData };
    this.tasks.set(id, updated);
    return updated;
  }

  async deleteTask(id: number): Promise<boolean> {
    return this.tasks.delete(id);
  }

  async updateTaskOrder(taskId: number, newOrder: number): Promise<void> {
    const task = this.tasks.get(taskId);
    if (task) {
      task.order = newOrder;
      this.tasks.set(taskId, task);
    }
  }

  async getChart(id: number): Promise<Chart | undefined> {
    return this.charts.get(id);
  }

  async getChartsByProjectId(projectId: number): Promise<Chart[]> {
    return Array.from(this.charts.values()).filter(
      (chart) => chart.projectId === projectId,
    );
  }

  async createChart(insertChart: InsertChart): Promise<Chart> {
    const id = this.currentChartId++;
    const chart: Chart = { 
      ...insertChart, 
      id, 
      createdAt: new Date(),
      projectId: insertChart.projectId || null,
      chartType: insertChart.chartType || null
    };
    this.charts.set(id, chart);
    return chart;
  }

  async updateChart(id: number, updateData: Partial<InsertChart>): Promise<Chart | undefined> {
    const chart = this.charts.get(id);
    if (!chart) return undefined;
    
    const updated = { ...chart, ...updateData };
    this.charts.set(id, updated);
    return updated;
  }

  async deleteChart(id: number): Promise<boolean> {
    return this.charts.delete(id);
  }
}

export const storage = new MemStorage();
