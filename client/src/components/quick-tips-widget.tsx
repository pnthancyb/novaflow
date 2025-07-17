import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Lightbulb, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface QuickTipsWidgetProps {
  currentTab: string;
  taskCount: number;
  hasChart: boolean;
}

interface Tip {
  id: string;
  title: string;
  description: string;
  action?: string;
  tab?: string;
}

export function QuickTipsWidget({ currentTab, taskCount, hasChart }: QuickTipsWidgetProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  // Context-aware tips based on current state
  const getTips = (): Tip[] => {
    const tips: Tip[] = [];

    if (currentTab === "tasks") {
      if (taskCount === 0) {
        tips.push({
          id: "add-first-task",
          title: "Start with Your First Task",
          description: "Click 'Add Task' to begin creating your project visualization",
          action: "Add a task with title, dates, and description"
        });
      } else if (taskCount < 3) {
        tips.push({
          id: "add-more-tasks",
          title: "Add More Tasks",
          description: "Add 2-3 more tasks to create a meaningful visualization",
          action: "Aim for 3-5 tasks for best results"
        });
      } else {
        tips.push({
          id: "generate-chart",
          title: "Ready to Generate!",
          description: "You have enough tasks. Use the AI button to create your chart",
          action: "Click 'Generate Chart with AI' at the bottom"
        });
      }

      tips.push({
        id: "task-details",
        title: "Rich Task Details",
        description: "Add descriptions and accurate dates for better AI visualizations",
        action: "Fill in all task fields completely"
      });
    }

    if (currentTab === "prompt") {
      tips.push({
        id: "describe-clearly",
        title: "Be Specific in Your Prompt",
        description: "Describe exactly what you want to visualize for better AI results",
        action: "Use phrases like 'Create a timeline' or 'Show dependencies'"
      });

      tips.push({
        id: "chart-types",
        title: "Let AI Choose the Best Type",
        description: "Keep 'Auto-select' unless you need a specific visualization",
        action: "AI will pick the most suitable chart type"
      });

      tips.push({
        id: "example-prompts",
        title: "Try Example Prompts",
        description: "Click any example below to see how effective prompts work",
        action: "Examples show best practices for AI prompts"
      });
    }

    if (currentTab === "preview") {
      if (!hasChart) {
        tips.push({
          id: "no-chart-yet",
          title: "Generate Your First Chart",
          description: "Switch to AI Tasks or AI Visualization to create a chart",
          action: "Generate a chart to see it here",
          tab: "tasks"
        });
      } else {
        tips.push({
          id: "export-options",
          title: "Export Your Chart",
          description: "Use the export button to save as PNG, SVG, or text",
          action: "Export in multiple formats for different uses"
        });

        tips.push({
          id: "edit-code",
          title: "Fine-tune Your Chart",
          description: "Click the code icon to manually edit the chart",
          action: "Adjust colors, text, or structure manually"
        });
      }
    }

    // General tips that apply everywhere
    tips.push({
      id: "mobile-friendly",
      title: "Mobile Optimized",
      description: "All features work perfectly on mobile devices",
      action: "Access your charts anywhere, anytime"
    });

    return tips;
  };

  const tips = getTips();
  const currentTip = tips[currentTipIndex] || tips[0];

  // Auto-rotate tips every 8 seconds
  useEffect(() => {
    if (tips.length > 1) {
      const interval = setInterval(() => {
        setCurrentTipIndex((prev) => (prev + 1) % tips.length);
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [tips.length]);

  // Reset tip index when changing tabs
  useEffect(() => {
    setCurrentTipIndex(0);
  }, [currentTab]);

  const handleNextTip = () => {
    setCurrentTipIndex((prev) => (prev + 1) % tips.length);
  };

  if (!isVisible || !currentTip) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="fixed bottom-6 right-6 z-50 w-80 max-w-[calc(100vw-2rem)]"
      >
        <Card className="shadow-xl border-2 border-primary/20 bg-background/95 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                <CardTitle className="text-sm font-medium">Quick Tip</CardTitle>
                {tips.length > 1 && (
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                    {currentTipIndex + 1} of {tips.length}
                  </span>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsVisible(false)}
                className="h-6 w-6 p-0 hover:bg-muted"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-sm mb-1">{currentTip.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {currentTip.description}
                </p>
              </div>
              
              {currentTip.action && (
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                  <p className="text-xs font-medium text-primary">
                    💡 {currentTip.action}
                  </p>
                </div>
              )}

              {tips.length > 1 && (
                <div className="flex items-center justify-between pt-2">
                  <div className="flex space-x-1">
                    {tips.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentTipIndex 
                            ? "bg-primary" 
                            : "bg-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleNextTip}
                    className="h-8 px-3 text-xs hover:bg-muted"
                  >
                    Next <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}