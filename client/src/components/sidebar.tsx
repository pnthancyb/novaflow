import { ChartGantt, Smartphone, TrendingUp, Code, Megaphone, Rocket, Settings, Download } from "lucide-react";

export function Sidebar() {
  return (
    <aside className="w-64 bg-muted border-r border-border p-4 overflow-y-auto custom-scrollbar">
      <div className="space-y-6">
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
  );
}
