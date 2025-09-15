import React, { useState, useEffect } from "react";
import { Editor } from "@monaco-editor/react";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { HelpTooltip } from "@/components/ui/help-tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { useScript, useUpdateScript } from "@/hooks/useScripts";
import { Loader2, Code2, FileCode, Database, Save } from "lucide-react";

const CATEGORIES = [
  { value: "data_processing", label: "Veri İşleme" },
  { value: "communication", label: "İletişim" },
  { value: "maintenance", label: "Bakım" },
  { value: "validation", label: "Doğrulama" },
  { value: "integration", label: "Entegrasyon" },
  { value: "automation", label: "Otomasyon" },
  { value: "reporting", label: "Raporlama" },
];

const FILE_EXTENSIONS = [
  { value: "py", label: "Python (.py)", language: "python" },
  { value: "js", label: "JavaScript (.js)", language: "javascript" },
  { value: "ts", label: "TypeScript (.ts)", language: "typescript" },
  { value: "sh", label: "Shell Script (.sh)", language: "shell" },
  { value: "sql", label: "SQL (.sql)", language: "sql" },
  { value: "json", label: "JSON (.json)", language: "json" },
];

export function EditScriptDialog({ open, onOpenChange, scriptId }) {
  const { theme } = useTheme();
  const { data: scriptData, isLoading } = useScript(scriptId);
  const updateScriptMutation = useUpdateScript();
  
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    subcategory: "",
    description: "",
    version: "",
    author: "",
    file_extension: "py",
    content: "",
    input_schema: "{}",
    output_schema: "{}",
    test_input_params: "{}",
    test_output_params: "{}"
  });

  const [activeTab, setActiveTab] = useState("basic");

  // Form verilerini script data'sından doldur
  useEffect(() => {
    if (scriptData?.data) {
      const script = scriptData.data;
      setFormData({
        name: script.name || "",
        category: script.category || "",
        subcategory: script.subcategory || "",
        description: script.description || "",
        version: script.version || "",
        author: script.author || "",
        file_extension: script.file_extension || "py",
        content: script.content || "",
        input_schema: script.input_schema || "{}",
        output_schema: script.output_schema || "{}",
        test_input_params: script.test_input_params || "{}",
        test_output_params: script.test_output_params || "{}"
      });
    }
  }, [scriptData]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!scriptId || !formData.name.trim() || !formData.category || !formData.content.trim()) {
      return;
    }

    try {
      await updateScriptMutation.mutateAsync({ 
        scriptId, 
        scriptData: formData 
      });
      onOpenChange(false);
    } catch (error) {
      // Hata toast hook tarafından işleniyor
    }
  };

  const selectedExtension = FILE_EXTENSIONS.find(ext => ext.value === formData.file_extension);

  if (!open || !scriptId) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Code2 className="w-5 h-5" />
            Script Düzenle
            {scriptData?.data && (
              <span className="font-mono ml-2">{scriptData.data.name}</span>
            )}
          </DialogTitle>
          <DialogDescription>
            Script bilgilerini ve içeriğini güncelleyin
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="ml-2">Script verisi yükleniyor...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">
                  <FileCode className="w-4 h-4 mr-2" />
                  Temel Bilgiler
                </TabsTrigger>
                <TabsTrigger value="code">
                  <Code2 className="w-4 h-4 mr-2" />
                  Kod Editörü
                </TabsTrigger>
                <TabsTrigger value="schema">
                  <Database className="w-4 h-4 mr-2" />
                  Schema & Test
                </TabsTrigger>
              </TabsList>

              <div className="mt-4 flex-1 overflow-hidden">
                <TabsContent value="basic" className="space-y-4 h-full overflow-y-auto">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="script-name" className="flex items-center gap-2">
                        Script Adı *
                        <HelpTooltip content="Benzersiz script adı" />
                      </Label>
                      <Input
                        id="script-name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="csv_processor"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="version">Versiyon</Label>
                      <Input
                        id="version"
                        value={formData.version}
                        onChange={(e) => handleInputChange("version", e.target.value)}
                        placeholder="1.0.0"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category" className="flex items-center gap-2">
                        Kategori *
                        <HelpTooltip content="Script kategorisi" />
                      </Label>
                      <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Kategori seçin" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border border-border shadow-md z-50">
                          {CATEGORIES.map(category => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subcategory">Alt Kategori</Label>
                      <Input
                        id="subcategory"
                        value={formData.subcategory}
                        onChange={(e) => handleInputChange("subcategory", e.target.value)}
                        placeholder="etl, backup, notification..."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="file-extension">Dosya Uzantısı</Label>
                      <Select value={formData.file_extension} onValueChange={(value) => handleInputChange("file_extension", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border border-border shadow-md z-50">
                          {FILE_EXTENSIONS.map(ext => (
                            <SelectItem key={ext.value} value={ext.value}>
                              {ext.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="author">Yazar</Label>
                      <Input
                        id="author"
                        value={formData.author}
                        onChange={(e) => handleInputChange("author", e.target.value)}
                        placeholder="admin@example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Açıklama</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Script'in ne yaptığını açıklayın..."
                      className="min-h-20"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="code" className="h-full">
                  <div className="space-y-2 h-full flex flex-col">
                    <Label className="flex items-center gap-2">
                      Script İçeriği * ({selectedExtension?.label})
                      <HelpTooltip content="Script kodunuzu buraya yazın" />
                    </Label>
                    <div className="flex-1 border rounded-lg overflow-hidden">
                      <Editor
                        height="400px"
                        language={selectedExtension?.language}
                        theme={theme === "dark" ? "vs-dark" : "light"}
                        value={formData.content}
                        onChange={(value) => handleInputChange("content", value || "")}
                        options={{
                          minimap: { enabled: false },
                          fontSize: 14,
                          wordWrap: "on",
                          scrollBeyondLastLine: false,
                          automaticLayout: true,
                        }}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="schema" className="space-y-4 h-full overflow-y-auto">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        Girdi Şeması (JSON)
                        <HelpTooltip content="Script'in beklediği girdi formatı" />
                      </Label>
                      <Textarea
                        value={formData.input_schema}
                        onChange={(e) => handleInputChange("input_schema", e.target.value)}
                        placeholder='{"type": "object", "properties": {...}}'
                        className="font-mono text-sm min-h-32"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        Çıktı Şeması (JSON)
                        <HelpTooltip content="Script'in döneceği sonuç formatı" />
                      </Label>
                      <Textarea
                        value={formData.output_schema}
                        onChange={(e) => handleInputChange("output_schema", e.target.value)}
                        placeholder='{"type": "object", "properties": {...}}'
                        className="font-mono text-sm min-h-32"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        Test Girdi Parametreleri
                        <HelpTooltip content="Script testinde kullanılacak örnek veri" />
                      </Label>
                      <Textarea
                        value={formData.test_input_params}
                        onChange={(e) => handleInputChange("test_input_params", e.target.value)}
                        placeholder='{"example": "data"}'
                        className="font-mono text-sm min-h-32"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        Beklenen Test Çıktısı
                        <HelpTooltip content="Test sonucunda beklenen çıktı" />
                      </Label>
                      <Textarea
                        value={formData.test_output_params}
                        onChange={(e) => handleInputChange("test_output_params", e.target.value)}
                        placeholder='{"expected": "result"}'
                        className="font-mono text-sm min-h-32"
                      />
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>

            <DialogFooter className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={updateScriptMutation.isPending}
              >
                İptal
              </Button>
              <Button
                type="submit"
                disabled={updateScriptMutation.isPending || !formData.name.trim() || !formData.category || !formData.content.trim()}
              >
                {updateScriptMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Güncelleniyor...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Değişiklikleri Kaydet
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}