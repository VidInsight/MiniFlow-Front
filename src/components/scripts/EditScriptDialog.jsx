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
        // Convert objects back to JSON strings for editing
        input_schema: script.input_schema ? JSON.stringify(script.input_schema, null, 2) : "{}",
        output_schema: script.output_schema ? JSON.stringify(script.output_schema, null, 2) : "{}",
        test_input_params: script.test_input_params ? JSON.stringify(script.test_input_params, null, 2) : "{}",
        test_output_params: script.test_output_params ? JSON.stringify(script.test_output_params, null, 2) : "{}"
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
    
    console.log('🔧 EditScript: Form submitted!');
    console.log('🔧 EditScript: Script ID:', scriptId);
    console.log('🔧 EditScript: Form data:', formData);
    
    if (!scriptId || !formData.content.trim()) {
      console.log('❌ EditScript: Validation failed - missing required fields');
      return;
    }

    // Validate JSON syntax only
    const jsonFields = ['input_schema', 'output_schema', 'test_input_params', 'test_output_params'];
    for (const field of jsonFields) {
      if (formData[field] && formData[field].trim()) {
        try {
          JSON.parse(formData[field]);
          console.log(`✅ EditScript: ${field} JSON is valid`);
        } catch (e) {
          console.log(`❌ EditScript: ${field} JSON is invalid:`, e.message);
          return; // Invalid JSON, don't submit
        }
      }
    }

    console.log('✅ EditScript: All validations passed');

    // Prepare data - parse JSON strings to objects (exclude read-only fields)
    const submitData = {
      content: formData.content.trim()
    };

    // Add optional editable fields only if they exist
    if (formData.description?.trim()) {
      submitData.description = formData.description.trim();
    }
    if (formData.version?.trim()) {
      submitData.version = formData.version.trim();
    }
    if (formData.author?.trim()) {
      submitData.author = formData.author.trim();
    }
    
    // Parse JSON schemas as objects (API expects objects, not strings)
    submitData.input_schema = formData.input_schema ? JSON.parse(formData.input_schema) : {};
    submitData.output_schema = formData.output_schema ? JSON.parse(formData.output_schema) : {};
    submitData.test_input_params = formData.test_input_params ? JSON.parse(formData.test_input_params) : {};
    submitData.test_output_params = formData.test_output_params ? JSON.parse(formData.test_output_params) : {};

    console.log('📤 EditScript: Prepared data for API:', submitData);

    try {
      console.log('🚀 EditScript: Calling update mutation...');
      const result = await updateScriptMutation.mutateAsync({ 
        scriptId, 
        scriptData: submitData 
      });
      console.log('🎉 EditScript: Update successful:', result);
      onOpenChange(false);
    } catch (error) {
      console.error('💥 EditScript: Update failed:', error);
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
                        Script Adı (Değiştirilemez)
                        <HelpTooltip content="Script adı güncellenemez" />
                      </Label>
                      <Input
                        id="script-name"
                        value={formData.name}
                        placeholder="csv_processor"
                        disabled
                        className="bg-muted cursor-not-allowed"
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
                        Kategori (Değiştirilemez)
                        <HelpTooltip content="Kategori güncellenemez" />
                      </Label>
                      <Input
                        id="category"
                        value={formData.category}
                        placeholder="data_processing, communication, automation..."
                        disabled
                        className="bg-muted cursor-not-allowed"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subcategory">Alt Kategori (Değiştirilemez)</Label>
                      <Input
                        id="subcategory"
                        value={formData.subcategory}
                        placeholder="etl, backup, notification..."
                        disabled
                        className="bg-muted cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="file-extension">Dosya Uzantısı (Değiştirilemez)</Label>
                      <Input
                        id="file-extension"
                        value={selectedExtension?.label || formData.file_extension}
                        disabled
                        className="bg-muted cursor-not-allowed"
                      />
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
                disabled={updateScriptMutation.isPending || !formData.content.trim()}
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