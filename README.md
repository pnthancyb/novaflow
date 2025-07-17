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

## 🔧 Installation

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Groq AI API key

### Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/novaflow.git
cd novaflow
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
GROQ_API_KEY=your_groq_api_key_here
DATABASE_URL=your_database_url_here
NODE_ENV=development
PORT=5000
```

4. Set up the database:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5000`

## 🎯 Usage

1. **Create a Project**: Enter your project name and basic details
2. **Add Tasks**: Define your project tasks with dates and descriptions
3. **Choose Visualization Type**: Select from various chart types or let AI auto-select
4. **Provide AI Instructions**: Tell AI how you want your data visualized
5. **Generate**: Click "Generate Visualization with AI" to create your chart
6. **Customize**: Use the code editor to manually adjust the generated chart
7. **Export**: Save your visualization as PNG, SVG, or PDF

## 🤖 AI Integration

NovaFlow uses Groq's fast inference API to analyze your project data and generate the most appropriate visualization. The AI can create:

- **Gantt Charts** for time-based project management
- **Flowcharts** for process workflows
- **Mind Maps** for hierarchical concepts
- **Timelines** for sequential events
- **State Diagrams** for system states
- **Graphs** for relationships and dependencies

## 📝 API Reference

### Generate Visualization
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