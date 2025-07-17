import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

interface MermaidChartProps {
  chart: string;
  className?: string;
}

export function MermaidChart({ chart, className = "" }: MermaidChartProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      mermaid.initialize({
        startOnLoad: false,
        theme: "base",
        themeVariables: {
          primaryColor: "#000000",
          primaryTextColor: "#ffffff",
          primaryBorderColor: "#000000",
          lineColor: "#333333",
          sectionBkgColor: "#f5f5f5",
          altSectionBkgColor: "#ffffff",
          gridColor: "#e0e0e0",
          secondaryColor: "#f5f5f5",
          tertiaryColor: "#ffffff"
        }
      });
      setIsInitialized(true);
    }
  }, [isInitialized]);

  useEffect(() => {
    if (elementRef.current && chart && isInitialized) {
      const renderChart = async () => {
        try {
          elementRef.current!.innerHTML = "";
          const { svg } = await mermaid.render(`mermaid-${Date.now()}`, chart);
          elementRef.current!.innerHTML = svg;
        } catch (error) {
          console.error("Error rendering Mermaid chart:", error);
          elementRef.current!.innerHTML = `
            <div class="flex items-center justify-center h-64 text-red-500">
              <div class="text-center">
                <p>Error rendering chart</p>
                <p class="text-sm mt-1">${error instanceof Error ? error.message : 'Unknown error'}</p>
              </div>
            </div>
          `;
        }
      };
      renderChart();
    }
  }, [chart, isInitialized]);

  return <div ref={elementRef} className={`${className} min-h-[500px] w-full`} />;
}
