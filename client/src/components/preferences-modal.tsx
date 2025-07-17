import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Settings, Palette, Zap, FileText, Download, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/use-translation";

export function PreferencesModal() {
  const [open, setOpen] = useState(false);
  const { t, language, setLanguage } = useTranslation();
  const [preferences, setPreferences] = useState({
    defaultChartType: "Auto-select best type",
    groqModel: "llama3-70b-8192",
    theme: "system",
    autoSave: true,
    showCodeEditor: true,
    exportFormat: "PNG",
    chartSize: "medium",
    gridLines: true,
    animations: true,
  });
  const { toast } = useToast();

  const handleSavePreferences = () => {
    localStorage.setItem("novaflow-preferences", JSON.stringify(preferences));
    toast({
      title: "Preferences Saved",
      description: "Your preferences have been saved successfully.",
    });
    setOpen(false);
  };

  const handleResetPreferences = () => {
    const defaultPrefs = {
      defaultChartType: "Auto-select best type",
      theme: "system",
      autoSave: true,
      showCodeEditor: true,
      exportFormat: "PNG",
      chartSize: "medium",
      gridLines: true,
      animations: true,
    };
    setPreferences(defaultPrefs);
    localStorage.removeItem("novaflow-preferences");
    toast({
      title: "Preferences Reset",
      description: "All preferences have been reset to default values.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Settings className="w-4 h-4 mr-2" />
          Preferences
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('preferences.title')}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* AI & Generation Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Zap className="w-5 h-5 mr-2" />
                AI & Generation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Groq AI Model</Label>
                <Select 
                  value={preferences.groqModel || "llama3-70b-8192"} 
                  onValueChange={(value) => setPreferences({...preferences, groqModel: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="llama3-70b-8192">Llama 3 70B (Default)</SelectItem>
                    <SelectItem value="llama-3.3-70b-versatile">Llama 3.3 70B Versatile</SelectItem>
                    <SelectItem value="llama3-8b-8192">Llama 3 8B (Fast)</SelectItem>
                    <SelectItem value="meta-llama/llama-4-maverick-17b-128e-instruct">Llama 4 Maverick 17B</SelectItem>
                    <SelectItem value="meta-llama/llama-4-scout-17b-16e-instruct">Llama 4 Scout 17B</SelectItem>
                    <SelectItem value="gemma2-9b-it">Gemma 2 9B</SelectItem>
                    <SelectItem value="llama-3.1-8b-instant">Llama 3.1 8B Instant</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Choose the AI model for chart generation</p>
              </div>
              
              <div className="space-y-2">
                <Label>Default Chart Type</Label>
                <Select 
                  value={preferences.defaultChartType} 
                  onValueChange={(value) => setPreferences({...preferences, defaultChartType: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Auto-select best type">Auto-select best type</SelectItem>
                    <SelectItem value="Gantt Chart">Gantt Chart</SelectItem>
                    <SelectItem value="Flowchart">Flowchart</SelectItem>
                    <SelectItem value="Mind Map">Mind Map</SelectItem>
                    <SelectItem value="Timeline">Timeline</SelectItem>
                    <SelectItem value="State Diagram">State Diagram</SelectItem>
                    <SelectItem value="Graph">Graph</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-save Projects</Label>
                  <p className="text-sm text-muted-foreground">Automatically save your work</p>
                </div>
                <Switch
                  checked={preferences.autoSave}
                  onCheckedChange={(checked) => setPreferences({...preferences, autoSave: checked})}
                />
              </div>
            </CardContent>
          </Card>

          {/* Appearance Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Palette className="w-5 h-5 mr-2" />
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Theme</Label>
                <Select 
                  value={preferences.theme} 
                  onValueChange={(value) => setPreferences({...preferences, theme: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Chart Size</Label>
                <Select 
                  value={preferences.chartSize} 
                  onValueChange={(value) => setPreferences({...preferences, chartSize: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                    <SelectItem value="full">Full Width</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show Grid Lines</Label>
                  <p className="text-sm text-muted-foreground">Display grid lines in charts</p>
                </div>
                <Switch
                  checked={preferences.gridLines}
                  onCheckedChange={(checked) => setPreferences({...preferences, gridLines: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Animations</Label>
                  <p className="text-sm text-muted-foreground">Enable smooth animations</p>
                </div>
                <Switch
                  checked={preferences.animations}
                  onCheckedChange={(checked) => setPreferences({...preferences, animations: checked})}
                />
              </div>
            </CardContent>
          </Card>

          {/* Editor Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <FileText className="w-5 h-5 mr-2" />
                Editor
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show Code Editor</Label>
                  <p className="text-sm text-muted-foreground">Display code editor by default</p>
                </div>
                <Switch
                  checked={preferences.showCodeEditor}
                  onCheckedChange={(checked) => setPreferences({...preferences, showCodeEditor: checked})}
                />
              </div>
            </CardContent>
          </Card>

          {/* Language Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Globe className="w-5 h-5 mr-2" />
                {t('preferences.language')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t('preferences.language')}</Label>
                <Select 
                  value={language} 
                  onValueChange={(value) => setLanguage(value as "en" | "tr" | "es")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">{t('preferences.english')}</SelectItem>
                    <SelectItem value="tr">{t('preferences.turkish')}</SelectItem>
                    <SelectItem value="es">{t('preferences.spanish')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Export Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Download className="w-5 h-5 mr-2" />
                {t('preferences.export')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t('preferences.defaultExportFormat')}</Label>
                <Select 
                  value={preferences.exportFormat} 
                  onValueChange={(value) => setPreferences({...preferences, exportFormat: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PNG">PNG</SelectItem>
                    <SelectItem value="SVG">SVG</SelectItem>
                    <SelectItem value="PDF">PDF</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator />

        <div className="flex justify-between">
          <Button variant="outline" onClick={handleResetPreferences}>
            Reset to Default
          </Button>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePreferences}>
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}