import { ChartGantt, Smartphone, TrendingUp, Code, Megaphone, Rocket, Settings, Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-muted border-r border-border
        transform transition-transform duration-300 ease-in-out lg:transform-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        sidebar-content
      `}>
      <div className="h-full p-4 space-y-6 overflow-y-auto custom-scrollbar">
        {/* Mobile close button */}
        <div className="flex justify-end lg:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">Recent Projects</h3>
          <div className="space-y-2">
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">No recent projects</p>
              <p className="text-xs mt-1">Create your first project to see it here</p>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <Button 
              variant="ghost" 
              className="w-full justify-start p-2 h-auto"
              onClick={() => window.location.reload()}
            >
              <Code className="w-4 h-4 mr-3 text-muted-foreground" />
              <span className="text-sm">New Project</span>
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start p-2 h-auto"
              onClick={() => console.log('Templates clicked')}
            >
              <Megaphone className="w-4 h-4 mr-3 text-muted-foreground" />
              <span className="text-sm">Templates</span>
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start p-2 h-auto"
              onClick={() => {
                const event = new CustomEvent('openModal', { detail: 'preferences' });
                window.dispatchEvent(event);
              }}
            >
              <Settings className="w-4 h-4 mr-3 text-muted-foreground" />
              <span className="text-sm">Preferences</span>
            </Button>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">Help & Support</h3>
          <div className="space-y-2">
            <Button 
              variant="ghost" 
              className="w-full justify-start p-2 h-auto"
              onClick={() => window.open('https://mermaid.js.org/syntax/gantt.html', '_blank')}
            >
              <Download className="w-4 h-4 mr-3 text-muted-foreground" />
              <span className="text-sm">Mermaid Docs</span>
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start p-2 h-auto"
              onClick={() => console.log('About clicked')}
            >
              <Rocket className="w-4 h-4 mr-3 text-muted-foreground" />
              <span className="text-sm">About NovaFlow</span>
            </Button>
          </div>
        </div>
      </div>
      </aside>
    </>
  );
}
