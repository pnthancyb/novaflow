import { ChartGantt, Smartphone, TrendingUp, Code, Megaphone, Rocket, Settings, Download } from "lucide-react";

export function Sidebar() {
  return (
    <aside className="w-64 bg-muted border-r border-border p-4 overflow-y-auto custom-scrollbar">
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">Recent Projects</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-background cursor-pointer transition-colors">
              <ChartGantt className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">Web App Launch</span>
            </div>
            <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-background cursor-pointer transition-colors">
              <Smartphone className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">Mobile Redesign</span>
            </div>
            <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-background cursor-pointer transition-colors">
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">Q4 Marketing</span>
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
