# NovaFlow - AI-Powered Visualization Generator

## Overview

NovaFlow is an open-source, Notion-style web application that uses AI to generate interactive Mermaid.js visualizations. Users input project data and AI intelligently chooses the best visualization type - whether it's a Gantt chart, flowchart, mind map, timeline, or any other Mermaid diagram. The application features a minimalist black-and-white design with dark/light theme support and real-time chart editing capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Full-Stack TypeScript Application
The application follows a monorepo structure with shared types and schemas between frontend and backend. It uses TypeScript throughout for type safety and better developer experience.

### Frontend Architecture
- **Framework**: React 18 with Vite for fast development and building
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system and theme support
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Chart Rendering**: Mermaid.js for Gantt chart visualization

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with JSON responses
- **Development**: Hot reload with Vite middleware integration

## Key Components

### Data Layer
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL with Neon serverless integration
- **Schema**: Shared schema definitions between client and server
- **Storage Interface**: Abstracted storage layer with in-memory fallback

### UI Components
- **Design System**: Custom theme with CSS variables for colors
- **Component Library**: Comprehensive set of reusable UI components
- **Layout**: Fixed header with sidebar navigation and main content area
- **Forms**: React Hook Form with Zod validation
- **Notifications**: Toast system for user feedback

### AI-Powered Chart Generation
- **Input Panel**: Task management interface with drag-and-drop ordering
- **AI Selection**: Intelligent chart type selection based on data and user instructions
- **Chart Display**: Real-time Mermaid.js rendering with export capabilities
- **Code Editor**: Modal for manual chart code editing
- **Export Options**: PNG, SVG, and PDF export functionality
- **Multiple Chart Types**: Support for Gantt charts, flowcharts, mind maps, timelines, state diagrams, and more

## Data Flow

### Project Management Flow
1. User creates/selects a project
2. Tasks are added with titles, descriptions, and date ranges
3. Tasks can be reordered and modified
4. Chart generation triggers API call to backend
5. Mermaid code is generated and displayed

### AI-Driven Chart Generation Flow
1. Frontend sends project data, tasks, and user instructions to `/api/generate-gantt` endpoint
2. Backend analyzes the data and user requirements using Groq AI
3. AI selects the optimal visualization type (Gantt, flowchart, mind map, etc.)
4. AI generates appropriate Mermaid.js code for the selected chart type
5. Generated code is returned and displayed in chart panel
6. Users can manually edit the code or export the chart

### Data Persistence
- Projects, tasks, and charts are stored in PostgreSQL
- Real-time updates use TanStack Query for optimistic updates
- Session management handles user state

## External Dependencies

### Core Dependencies
- **Database**: PostgreSQL for data persistence
- **AI Service**: Groq API for intelligent chart generation
- **Authentication**: Session-based (connect-pg-simple)
- **UI Components**: Radix UI primitives for accessibility
- **Charts**: Mermaid.js for diagram generation
- **Validation**: Zod for runtime type validation

### Development Tools
- **Build Tool**: Vite with React plugin
- **Type Checking**: TypeScript compiler
- **Database Migrations**: Drizzle Kit
- **Replit Integration**: Custom plugins for development environment

## Deployment Strategy

### Build Process
- Frontend builds to `dist/public` directory
- Backend builds with esbuild for Node.js ES modules
- Shared schemas compiled for both environments

### Environment Configuration
- Database URL required for PostgreSQL connection
- Development mode includes Vite middleware for HMR
- Production serves static files from Express

### Development Workflow
- `npm run dev` starts development server with hot reload
- `npm run build` creates production-ready builds
- `npm run db:push` applies database schema changes
- TypeScript checking with `npm run check`

### Hosting Considerations
- Designed for Replit deployment with custom plugins
- Supports both development and production environments
- Database migrations handled through Drizzle Kit
- Static asset serving through Express in production

## Recent Changes and Improvements

### January 17, 2025 - Migration and Architecture Overhaul
- **Completed Replit Migration**: Successfully migrated project from Replit Agent to standard Replit environment
- **Mobile-Responsive Design**: Added collapsible sidebar with hamburger menu for mobile devices, optimized touch interfaces
- **Chart System Rewrite**: Completely rebuilt chart rendering and export system from scratch for reliability
  - New `ChartRenderer` component with robust error handling and SVG management
  - New `ChartExport` component with PNG, SVG, and text export functionality  
  - Fixed chart visibility and export issues
- **Embedded Chart Preview**: Moved chart preview from modal overlay to fixed sidebar panel
- **Enhanced Layout**: Improved responsive layout with proper mobile breakpoints and spacing
- **Export Integration**: Integrated export buttons directly into chart preview panel

## Key Features Implemented
- **Draggable Chart Preview**: Charts open in resizable, movable modal windows
- **Multi-language Support**: Turkish and Spanish translations integrated
- **High-Quality Exports**: PNG exports with 1x-4x resolution scaling
- **Professional UI**: Comprehensive modal system with proper error handling
- **Responsive Design**: Optimized layout without sidebar constraints