import React, { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { HelpTooltip } from "@/components/ui/help-tooltip";
import { Label } from "@/components/ui/label";
import { useScript, useScriptTestStats, useScriptPerformanceStats } from "@/hooks/useScripts";
import { formatFileSize, formatDate } from "@/lib/fileUtils";
import {
  Code2,
  FileText,
  BarChart3,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
  User,
  Calendar,
  Tag,
  Database,
  TestTube,
  Activity,
  TrendingUp,
  Cpu,
  HardDrive
} from "lucide-react";

const getCategoryBadge = (category) => {
  const variants = {
    "data_processing": "success",
    "communication": "secondary", 
    "maintenance": "warning",
    "validation": "outline",
    "integration": "default",
    "automation": "secondary",
    "reporting": "outline"
  };
  
  return <Badge variant={variants[category] || "outline"}>
    {category?.replace('_', ' ')}
  </Badge>;
};

const getExtensionBadge = (extension) => {
  const colors = {
    "py": "success",
    "js": "warning",
    "ts": "secondary", 
    "sh": "outline",
    "sql": "default",
    "json": "outline"
  };
  
  return <Badge variant={colors[extension] || "outline"}>
    {extension?.toUpperCase()}
  </Badge>;
};

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
      {title && <Label className="text-sm font-medium">{title}</Label>}
      <div className="border rounded-lg p-3 bg-muted/50">
        <pre className="text-sm font-mono overflow-auto max-h-32 whitespace-pre-wrap">
          <code>{jsonString}</code>
        </pre>
      </div>
    </div>
  );
};

export function ScriptDetailsDialog({ open, onOpenChange, scriptId }) {
  const { theme } = useTheme();
  const [activeView, setActiveView] = useState("details");
  
  const { data: scriptData, isLoading: isLoadingScript } = useScript(scriptId);
  const { data: testStatsData, isLoading: isLoadingTestStats } = useScriptTestStats(scriptId);
  const { data: performanceStatsData, isLoading: isLoadingPerformanceStats } = useScriptPerformanceStats(scriptId);

  const script = scriptData?.data;
  const testStats = testStatsData?.data;
  const performanceStats = performanceStatsData?.data;

  if (!open || !scriptId) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Code2 className="w-5 h-5" />
            Script Detayları
            {script && (
              <div className="flex items-center gap-2 ml-4">
                <span className="font-mono text-lg">{script.name}</span>
                {getExtensionBadge(script.file_extension)}
              </div>
            )}
          </DialogTitle>
          <div className="flex gap-2 mt-4">
            <Button
              variant={activeView === "details" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveView("details")}
            >
              <FileText className="w-4 h-4 mr-2" />
              Detaylar
            </Button>
            <Button
              variant={activeView === "code" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveView("code")}
            >
              <Code2 className="w-4 h-4 mr-2" />
              Kod
            </Button>
            <Button
              variant={activeView === "test-stats" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveView("test-stats")}
            >
              <TestTube className="w-4 h-4 mr-2" />
              Test İstatistikleri
            </Button>
            <Button
              variant={activeView === "performance" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveView("performance")}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Performans
            </Button>
          </div>
        </DialogHeader>

        {isLoadingScript ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="ml-2">Script detayları yükleniyor...</span>
          </div>
        ) : !script ? (
          <div className="text-center py-8 text-muted-foreground">
            Script bulunamadı veya yüklenirken hata oluştu.
          </div>
        ) : (
          <div className="flex-1 overflow-hidden">
            <div className="mt-4 flex-1 overflow-hidden">
              {activeView === "details" && (
                <div className="space-y-4 h-full overflow-y-auto">
                  <div className="grid grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Tag className="w-4 h-4" />
                          Temel Bilgiler
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span className="font-medium">Ad:</span>
                          <span className="font-mono">{script.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Kategori:</span>
                          {getCategoryBadge(script.category)}
                        </div>
                        {script.subcategory && (
                          <div className="flex justify-between">
                            <span className="font-medium">Alt Kategori:</span>
                            <span>{script.subcategory}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="font-medium">Versiyon:</span>
                          <Badge variant="outline">{script.version}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Dosya Uzantısı:</span>
                          {getExtensionBadge(script.file_extension)}
                        </div>
                        {script.author && (
                          <div className="flex justify-between">
                            <span className="font-medium">Yazar:</span>
                            <span>{script.author}</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Dosya Bilgileri
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {script.file_path && (
                          <div className="space-y-1">
                            <span className="font-medium">Dosya Yolu:</span>
                            <p className="text-sm font-mono bg-muted p-2 rounded break-all">
                              {script.file_path}
                            </p>
                          </div>
                        )}
                        {script.file_size && (
                          <div className="flex justify-between">
                            <span className="font-medium">Dosya Boyutu:</span>
                            <span>{formatFileSize(script.file_size)}</span>
                          </div>
                        )}
                        {script.checksum && (
                          <div className="space-y-1">
                            <span className="font-medium">Checksum:</span>
                            <p className="text-xs font-mono bg-muted p-2 rounded break-all">
                              {script.checksum}
                            </p>
                          </div>
                        )}
                        {script.created_at && (
                          <div className="flex justify-between">
                            <span className="font-medium">Oluşturulma:</span>
                            <span>{formatDate(script.created_at)}</span>
                          </div>
                        )}
                        {script.updated_at && (
                          <div className="flex justify-between">
                            <span className="font-medium">Güncelleme:</span>
                            <span>{formatDate(script.updated_at)}</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {script.description && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Açıklama</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{script.description}</p>
                      </CardContent>
                    </Card>
                  )}

                    <div className="grid grid-cols-2 gap-6">
                      {(script.input_schema && JSON.stringify(script.input_schema) !== "{}") && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Database className="w-4 h-4" />
                              Girdi Şeması
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <JsonViewer data={script.input_schema} title="" />
                          </CardContent>
                        </Card>
                      )}

                      {(script.output_schema && JSON.stringify(script.output_schema) !== "{}") && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Database className="w-4 h-4" />
                              Çıktı Şeması
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <JsonViewer data={script.output_schema} title="" />
                          </CardContent>
                        </Card>
                      )}
                    </div>
                </div>
              )}

              {activeView === "code" && (
                <div className="space-y-2 h-full flex flex-col">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Script Kodu</h3>
                    <Badge variant="outline">
                      {script.file_extension?.toUpperCase()} - {script.name}
                    </Badge>
                  </div>
                  <div className="flex-1 border rounded-lg overflow-hidden bg-muted/50">
                    <pre className="p-4 text-sm font-mono overflow-auto h-96 whitespace-pre-wrap">
                      <code>{script.content || "// Kod içeriği bulunamadı"}</code>
                    </pre>
                  </div>
                </div>
              )}

              {activeView === "test-stats" && (
                <div className="space-y-4 h-full overflow-y-auto">
                  {isLoadingTestStats ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span className="ml-2">Test istatistikleri yükleniyor...</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <TestTube className="w-4 h-4" />
                            Test Durumu
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center gap-2">
                            {testStats?.test_status === "PASSED" ? (
                              <CheckCircle2 className="w-5 h-5 text-success" />
                            ) : testStats?.test_status === "FAILED" ? (
                              <XCircle className="w-5 h-5 text-destructive" />
                            ) : (
                              <AlertTriangle className="w-5 h-5 text-warning" />
                            )}
                            <span className="font-medium">
                              {testStats?.test_status === "PASSED" ? "Başarılı" :
                               testStats?.test_status === "FAILED" ? "Başarısız" : "Belirsiz"}
                            </span>
                          </div>
                          {testStats?.test_coverage && (
                            <div className="space-y-1">
                              <span className="text-sm font-medium">Test Kapsamı: %{testStats.test_coverage}</span>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div 
                                  className="bg-primary h-2 rounded-full transition-all"
                                  style={{ width: `${testStats.test_coverage}%` }}
                                />
                              </div>
                            </div>
                          )}
                          {testStats?.last_test_run_at && (
                            <div className="flex justify-between">
                              <span className="font-medium">Son Test:</span>
                              <span>{formatDate(testStats.last_test_run_at)}</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {testStats?.test_results && (
                        <Card>
                          <CardHeader>
                            <CardTitle>Test Sonuçları</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <JsonViewer data={testStats.test_results} title="" />
                          </CardContent>
                        </Card>
                      )}

                      {(script.test_input_params && JSON.stringify(script.test_input_params) !== "{}") && (
                        <Card>
                          <CardHeader>
                            <CardTitle>Test Girdi Parametreleri</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <JsonViewer data={script.test_input_params} title="" />
                          </CardContent>
                        </Card>
                      )}

                      {(script.test_output_params && JSON.stringify(script.test_output_params) !== "{}") && (
                        <Card>
                          <CardHeader>
                            <CardTitle>Beklenen Test Çıktısı</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <JsonViewer data={script.test_output_params} title="" />
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  )}
                </div>
              )}

              {activeView === "performance" && (
                <div className="space-y-4 h-full overflow-y-auto">
                  {isLoadingPerformanceStats ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span className="ml-2">Performans istatistikleri yükleniyor...</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Activity className="w-4 h-4" />
                            Çalışma İstatistikleri
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {performanceStats?.avg_execution_time && (
                            <div className="flex justify-between">
                              <span className="font-medium">Ortalama Süre:</span>
                              <span>{performanceStats.avg_execution_time}s</span>
                            </div>
                          )}
                          {performanceStats?.success_rate && (
                            <div className="flex justify-between">
                              <span className="font-medium">Başarı Oranı:</span>
                              <span>%{performanceStats.success_rate}</span>
                            </div>
                          )}
                          {performanceStats?.total_executions && (
                            <div className="flex justify-between">
                              <span className="font-medium">Toplam Çalıştırma:</span>
                              <span>{performanceStats.total_executions}</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Cpu className="w-4 h-4" />
                            Sistem Kaynakları
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {performanceStats?.performance_metrics?.cpu_usage?.avg && (
                            <div className="flex justify-between">
                              <span className="font-medium">Ortalama CPU:</span>
                              <span>{performanceStats.performance_metrics.cpu_usage.avg}</span>
                            </div>
                          )}
                          {performanceStats?.performance_metrics?.memory_usage?.avg && (
                            <div className="flex justify-between">
                              <span className="font-medium">Ortalama RAM:</span>
                              <span>{performanceStats.performance_metrics.memory_usage.avg}</span>
                            </div>
                          )}
                          {performanceStats?.performance_metrics?.memory_usage?.peak && (
                            <div className="flex justify-between">
                              <span className="font-medium">En Yüksek RAM:</span>
                              <span>{performanceStats.performance_metrics.memory_usage.peak}</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}