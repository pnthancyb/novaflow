# NovaFlow - AI-Powered Visualization Generator

![NovaFlow Logo](https://img.shields.io/badge/NovaFlow-AI%20Visualization-black?style=for-the-badge)

NovaFlow is an open-source, Notion-style web application that uses AI to generate interactive Mermaid.js visualizations. With a minimalist black-and-white design, it lets users input project data and have AI intelligently choose the best visualization type - whether it's a Gantt chart, flowchart, mind map, timeline, or any other Mermaid diagram.

## ✨ Features

- **AI-Driven Visualization**: Let AI choose the optimal chart type based on your data and requirements
- **Multiple Chart Types**: Supports Gantt charts, flowcharts, mind maps, timelines, state diagrams, and more
- **Real-time Editor**: Live code editor with preview for manual chart customization
- **Export Options**: Export visualizations as PNG, SVG, or PDF
- **Dark/Light Theme**: Minimalist black-and-white design with theme toggle
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Drag-and-Drop Interface**: Notion-style task management with intuitive controls

## 🚀 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Shadcn/ui** components built on Radix UI
- **TanStack Query** for server state management
- **Wouter** for lightweight routing
- **Mermaid.js** for chart rendering

### Backend
- **Node.js** with Express.js
- **TypeScript** throughout
- **Drizzle ORM** for database operations
- **PostgreSQL** for data persistence
- **Groq AI** for intelligent chart generation

## 🔧 Installation & Development Setup

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Groq AI API key ([Get one here](https://console.groq.com/))

### Quick Setup

1. **Clone the repository**:
```bash
git clone https://github.com/yourusername/novaflow.git
cd novaflow
```

2. **Install dependencies**:
```bash
npm install
```

3. **Set up environment variables**:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
GROQ_API_KEY=your_groq_api_key_here
DATABASE_URL=postgresql://username:password@localhost:5432/novaflow
NODE_ENV=development
PORT=5000
```

4. **Set up the database**:
```bash
npm run db:push
```

5. **Start the development server**:
```bash
npm run dev
```

The app will be available at `http://localhost:5000`

### 📁 Project Structure & File Customization

Understanding the project structure will help you customize and extend NovaFlow:

```
novaflow/
├── client/                     # React frontend application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── ui/            # Base UI components (buttons, inputs, etc.)
│   │   │   ├── header.tsx     # Main navigation header
│   │   │   ├── sidebar.tsx    # Project sidebar navigation
│   │   │   ├── task-input-panel.tsx    # Structured data input
│   │   │   ├── prompt-generator.tsx    # AI prompt interface
│   │   │   ├── chart-display-panel.tsx # Chart rendering & controls
│   │   │   ├── mermaid-chart.tsx       # Mermaid.js integration
│   │   │   └── code-editor-modal.tsx   # Code editing interface
│   │   ├── pages/             # Application pages
│   │   │   ├── dashboard.tsx   # Main dashboard layout
│   │   │   └── not-found.tsx   # 404 error page
│   │   ├── hooks/             # Custom React hooks
│   │   │   ├── use-theme.tsx   # Theme management
│   │   │   ├── use-toast.ts    # Toast notifications
│   │   │   └── use-mobile.tsx  # Mobile detection
│   │   ├── lib/               # Utility functions
│   │   │   ├── utils.ts        # General utilities
│   │   │   └── queryClient.ts  # API client setup
│   │   ├── App.tsx            # Main app component
│   │   ├── main.tsx           # App entry point
│   │   └── index.css          # Global styles & theme
│   └── index.html             # HTML template
├── server/                    # Express.js backend
│   ├── index.ts              # Server entry point
│   ├── routes.ts             # API route definitions
│   ├── storage.ts            # Database layer & operations
│   └── vite.ts               # Vite middleware setup
├── shared/                   # Shared types & schemas
│   └── schema.ts            # Database schemas & validation
├── docs/                    # Documentation files
├── .env.example            # Environment template
├── .env                    # Your environment variables
├── package.json            # Dependencies & scripts
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite build configuration
└── drizzle.config.ts       # Database configuration
```

### 🎨 Customization Guide

#### **Frontend Components**

**Header (`client/src/components/header.tsx`)**:
- Customize navigation items, logo, and user interface
- Add new menu items or authentication features
- Modify theme toggle behavior

**Sidebar (`client/src/components/sidebar.tsx`)**:
- Add new navigation sections or project filters
- Customize recent projects display
- Integrate with user project data

**Task Input Panel (`client/src/components/task-input-panel.tsx`)**:
- Modify task fields and validation rules
- Add new input types (dependencies, resources, etc.)
- Customize project settings interface

**Prompt Generator (`client/src/components/prompt-generator.tsx`)**:
- Add new example prompts for different use cases
- Customize chart type options
- Modify AI instruction templates

**Chart Display (`client/src/components/chart-display-panel.tsx`)**:
- Customize export formats and quality settings
- Add new chart interaction features
- Modify chart container styling

#### **Backend API**

**Routes (`server/routes.ts`)**:
- Add new API endpoints for additional features
- Modify AI prompt engineering for better results
- Add authentication and user management

**Storage (`server/storage.ts`)**:
- Extend database operations
- Add new data models
- Implement caching strategies

**Schema (`shared/schema.ts`)**:
- Define new database tables
- Add validation rules
- Create new data types

#### **Styling & Themes**

**Global Styles (`client/src/index.css`)**:
- Customize color scheme and CSS variables
- Add new utility classes
- Modify component-specific styles

**Tailwind Config (`tailwind.config.ts`)**:
- Add custom colors and spacing
- Define new component variants
- Add custom utilities

#### **AI Integration**

**Groq API Configuration**:
- Modify model parameters in `server/routes.ts`
- Adjust prompt engineering for better results
- Add new AI endpoints for different visualization types

**Mermaid.js Integration**:
- Customize chart themes in `client/src/components/mermaid-chart.tsx`
- Add new diagram types support
- Modify export functionality

### 🔧 Development Scripts

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Type checking
npm run check

# Database operations
npm run db:push          # Apply schema changes
npm run db:studio        # Open database studio (if available)

# Linting and formatting
npm run lint            # Check code quality
npm run format          # Format code
```

### 🗄️ Database Management

NovaFlow uses Drizzle ORM for database operations. To modify the database:

1. **Update schema** in `shared/schema.ts`
2. **Push changes** with `npm run db:push`
3. **Update storage layer** in `server/storage.ts`
4. **Add API endpoints** in `server/routes.ts`

### 🎯 Usage

NovaFlow offers two ways to create visualizations:

### Method 1: Structured Input
1. **Create a Project**: Enter your project name and basic details
2. **Add Tasks**: Define your project tasks with dates and descriptions
3. **Choose Visualization Type**: Select from various chart types or let AI auto-select
4. **Provide AI Instructions**: Tell AI how you want your data visualized
5. **Generate**: Click "Generate Visualization with AI" to create your chart

### Method 2: AI Prompt (Recommended)
1. **Switch to AI Prompt tab**: Use the simple prompt interface
2. **Describe Your Vision**: Tell AI what you want to visualize in plain English
3. **Select Chart Type**: Choose a preferred type or let AI decide
4. **Generate**: AI will create the perfect visualization for your description

### Common Actions
- **Customize**: Use the code editor to manually adjust the generated chart
- **Export**: Save your visualization as PNG, SVG, or PDF
- **Share**: Copy the Mermaid code to use in documentation or presentations

## 🤖 AI Integration

NovaFlow uses Groq's fast inference API to analyze your project data and generate the most appropriate visualization. The AI can create:

- **Gantt Charts** for time-based project management
- **Flowcharts** for process workflows
- **Mind Maps** for hierarchical concepts
- **Timelines** for sequential events
- **State Diagrams** for system states
- **Graphs** for relationships and dependencies

## 📝 API Reference

### Generate from Structured Data
```http
POST /api/generate-gantt
Content-Type: application/json

{
  "projectName": "My Project",
  "tasks": [
    {
      "title": "Task 1",
      "startDate": "2025-01-01",
      "endDate": "2025-01-05",
      "description": "Task description"
    }
  ],
  "instructions": "Create a flowchart showing the process flow",
  "chartStyle": "Flowchart"
}
```

### Generate from AI Prompt
```http
POST /api/generate-from-prompt
Content-Type: application/json

{
  "prompt": "Create a software development workflow from planning to deployment",
  "chartType": "Flowchart"
}
```

### Response
```json
{
  "mermaidCode": "flowchart TD\n    A[Start] --> B[Task 1]\n    B --> C[End]"
}
```

## 🛠️ Development

### Project Structure
```
novaflow/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/         # Application pages
│   │   ├── hooks/         # Custom hooks
│   │   └── lib/           # Utilities
├── server/                # Express backend
│   ├── routes.ts          # API endpoints
│   ├── storage.ts         # Database layer
│   └── index.ts           # Server entry
├── shared/                # Shared types and schemas
│   └── schema.ts          # Database schemas
└── package.json
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run db:push` - Push database schema changes
- `npm run check` - Type checking

## 🌟 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Mermaid.js](https://mermaid.js.org/) for the amazing diagramming library
- [Groq](https://groq.com/) for ultra-fast AI inference
- [Shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling

## 🔗 Links

- [Demo](https://novaflow.demo.com)
- [Documentation](https://docs.novaflow.com)
- [Issues](https://github.com/yourusername/novaflow/issues)
- [Discussions](https://github.com/yourusername/novaflow/discussions)

---

Made with ❤️ by the NovaFlow team