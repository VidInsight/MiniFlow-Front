import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useScriptPerformanceStats } from "@/hooks/useScripts";
import { BarChart3, Loader2 } from "lucide-react";

const JsonViewer = ({ data, title }) => {
  let jsonString = "";
  try {
    if (typeof data === 'string') {
      jsonString = data;
    } else if (typeof data === 'object' && data !== null) {
      jsonString = JSON.stringify(data, null, 2);
    } else {
      jsonString = String(data || "{}");
    }
  } catch (error) {
    jsonString = String(data || "{}");
  }

  return (
    <div className="space-y-2">
      {title && <label className="text-sm font-medium">{title}</label>}
      <div className="border rounded-lg p-3 bg-muted/50">
        <pre className="text-sm font-mono overflow-auto max-h-96 whitespace-pre-wrap">
          <code>{jsonString}</code>
        </pre>
      </div>
    </div>
  );
};

export function PerformanceStatsDialog({ open, onOpenChange, scriptId }) {
  const { data: performanceStatsData, isLoading, refetch } = useScriptPerformanceStats(scriptId, { 
    enabled: !!scriptId && open 
  });

  const performanceStats = performanceStatsData?.data;

  // Refetch when dialog opens
  React.useEffect(() => {
    if (open && scriptId) {
      refetch();
    }
  }, [open, scriptId, refetch]);

  if (!open || !scriptId) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Performans İstatistikleri
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="ml-2">Performans istatistikleri yükleniyor...</span>
          </div>
        ) : (
          <div className="space-y-4 h-full overflow-y-auto">
            {performanceStats ? (
              <Card>
                <CardHeader>
                  <CardTitle>Performans Metrikleri</CardTitle>
                </CardHeader>
                <CardContent>
                  <JsonViewer data={performanceStats} title="" />
                </CardContent>
              </Card>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Performans istatistikleri bulunamadı.
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}