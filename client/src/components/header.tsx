import { Separator } from "@/components/ui/separator";
import { Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { PreferencesModal } from "@/components/preferences-modal";
import { TemplatesModal } from "@/components/templates-modal";
import { ProjectsModal } from "@/components/projects-modal";

interface HeaderProps {
  onSelectProject?: (project: any) => void;
  onSelectTemplate?: (template: any) => void;
}

export function Header({ onSelectProject, onSelectTemplate }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 bg-background border-b border-border z-40">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-6 h-6" />
            <span className="text-xl font-bold">NovaFlow</span>
          </div>
          
          <Separator orientation="vertical" className="h-6" />
          
          <nav className="flex items-center space-x-1">
            <ProjectsModal onSelectProject={onSelectProject || (() => {})} />
            <TemplatesModal onSelectTemplate={onSelectTemplate || (() => {})} />
            <PreferencesModal />
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
