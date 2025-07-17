import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileImage, FileCode, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/use-translation";

interface ExportModalProps {
  mermaidCode: string;
  onExport?: (format: string, quality: string) => void;
}

export function ExportModal({ mermaidCode, onExport }: ExportModalProps) {
  const [open, setOpen] = useState(false);
  const [format, setFormat] = useState("PNG");
  const [quality, setQuality] = useState("high");
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleExport = async () => {
    if (!mermaidCode) {
      toast({
        title: t('chart.exportFailed'),
        description: t('chart.noChartToExport'),
        variant: "destructive"
      });
      return;
    }

    setIsExporting(true);

    try {
      const svgElement = document.querySelector('.mermaid-chart-svg') as SVGElement;
      if (!svgElement) {
        throw new Error('Chart not found');
      }

      if (format === "PNG") {
        await exportToPNG(svgElement, quality);
      } else if (format === "SVG") {
        await exportToSVG(svgElement);
      } else if (format === "Code") {
        await exportToCode();
      }

      toast({
        title: "Export Successful",
        description: `Chart exported as ${format}`,
      });

      if (onExport) {
        onExport(format, quality);
      }

      setOpen(false);
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: t('chart.exportFailed'),
        description: error instanceof Error ? error.message : "Export failed",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const exportToPNG = async (svgElement: SVGElement, quality: string) => {
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context not available');

    // Set quality scale
    const scale = quality === "ultra" ? 4 : quality === "high" ? 3 : quality === "medium" ? 2 : 1;
    const svgRect = svgElement.getBoundingClientRect();
    
    canvas.width = svgRect.width * scale;
    canvas.height = svgRect.height * scale;
    
    ctx.scale(scale, scale);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width / scale, canvas.height / scale);

    const img = new Image();
    const url = URL.createObjectURL(svgBlob);
    
    return new Promise((resolve, reject) => {
      img.onload = () => {
        ctx.drawImage(img, 0, 0, svgRect.width, svgRect.height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const link = document.createElement('a');
            link.download = `novaflow-chart-${quality}-${Date.now()}.png`;
            link.href = URL.createObjectURL(blob);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            resolve(true);
          } else {
            reject(new Error('Failed to create blob'));
          }
        }, 'image/png', 1.0);
        
        URL.revokeObjectURL(url);
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load SVG'));
      };
      
      img.src = url;
    });
  };

  const exportToSVG = async (svgElement: SVGElement) => {
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    
    const link = document.createElement('a');
    link.download = `novaflow-chart-${Date.now()}.svg`;
    link.href = URL.createObjectURL(blob);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToCode = async () => {
    const blob = new Blob([mermaidCode], { type: 'text/plain;charset=utf-8' });
    
    const link = document.createElement('a');
    link.download = `novaflow-chart-${Date.now()}.mmd`;
    link.href = URL.createObjectURL(blob);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={!mermaidCode}>
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Export Chart</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <FileImage className="w-5 h-5 mr-2" />
                Export Format
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Format</Label>
                <Select value={format} onValueChange={setFormat}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PNG">PNG Image</SelectItem>
                    <SelectItem value="SVG">SVG Vector</SelectItem>
                    <SelectItem value="Code">Mermaid Code</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {format === "PNG" && (
                <div className="space-y-2">
                  <Label>Quality</Label>
                  <Select value={quality} onValueChange={setQuality}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard (1x)</SelectItem>
                      <SelectItem value="medium">Medium (2x)</SelectItem>
                      <SelectItem value="high">High (3x)</SelectItem>
                      <SelectItem value="ultra">Ultra (4x)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleExport} disabled={isExporting || !mermaidCode}>
              {isExporting ? "Exporting..." : "Export"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}