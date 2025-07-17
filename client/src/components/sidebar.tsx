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
        w-64 bg-muted border-r border-border p-4 overflow-y-auto custom-scrollbar
        transform transition-transform duration-300 ease-in-out lg:transform-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
      <div className="space-y-6">
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
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">Templates</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-background cursor-pointer transition-colors">
              <Code className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">Software Development</span>
            </div>
            <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-background cursor-pointer transition-colors">
              <Megaphone className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">Marketing Campaign</span>
            </div>
            <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-background cursor-pointer transition-colors">
              <Rocket className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">Product Launch</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">Settings</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-background cursor-pointer transition-colors">
              <Settings className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">Preferences</span>
            </div>
            <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-background cursor-pointer transition-colors">
              <Download className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">Export History</span>
            </div>
          </div>
        </div>
      </div>
      </aside>
    </>
  );
}
