import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Sparkles, Menu } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { PreferencesModal } from "@/components/preferences-modal";
import { TemplatesModal } from "@/components/templates-modal";
import { ProjectsModal } from "@/components/projects-modal";

interface HeaderProps {
  onSelectProject?: (project: any) => void;
  onApplyTemplate?: (template: any) => void;
  onToggleSidebar?: () => void;
}

export function Header({ onSelectProject, onApplyTemplate, onToggleSidebar }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 bg-background border-b border-border z-40">
      <div className="flex items-center justify-between px-4 lg:px-6 py-3">
        <div className="flex items-center space-x-4 lg:space-x-6">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={onToggleSidebar}
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 lg:w-6 lg:h-6" />
            <span className="text-lg lg:text-xl font-bold">NovaFlow</span>
          </div>
          
          <Separator orientation="vertical" className="h-6 hidden sm:block" />
          
          <nav className="flex items-center space-x-1">
            <div className="hidden sm:flex items-center space-x-1">
              <ProjectsModal onSelectProject={onSelectProject || (() => {})} />
              <TemplatesModal onApplyTemplate={onApplyTemplate || (() => {})} />
            </div>
            <PreferencesModal />
          </nav>
        </div>
        
        <div className="flex items-center space-x-2 lg:space-x-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
