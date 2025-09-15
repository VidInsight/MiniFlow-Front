import React, { useState } from "react";
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
import { useCreateScript } from "@/hooks/useScripts";
import { Loader2, Code2, FileCode, Database } from "lucide-react";

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

const DEFAULT_TEMPLATES = {
  py: `def main(input_data):
    """
    Ana script fonksiyonu
    
    Args:
        input_data: Girdi verileri
        
    Returns:
        İşlenmiş sonuç verileri
    """
    # Script kodunuzu buraya yazın
    
    return {"status": "success", "data": input_data}

if __name__ == "__main__":
    # Test için örnek veri
    test_input = {"message": "Merhaba Dünya"}
    result = main(test_input)
    print(result)`,
  
  js: `function main(inputData) {
    /**
     * Ana script fonksiyonu
     * 
     * @param {Object} inputData - Girdi verileri
     * @returns {Object} İşlenmiş sonuç verileri
     */
    
    // Script kodunuzu buraya yazın
    
    return {
        status: "success",
        data: inputData
    };
}

// Test için örnek kullanım
const testInput = { message: "Merhaba Dünya" };
console.log(main(testInput));

module.exports = { main };`,
  
  ts: `interface InputData {
    [key: string]: any;
}

interface OutputData {
    status: string;
    data: any;
}

function main(inputData: InputData): OutputData {
    /**
     * Ana script fonksiyonu
     */
    
    // Script kodunuzu buraya yazın
    
    return {
        status: "success",
        data: inputData
    };
}

// Test için örnek kullanım
const testInput: InputData = { message: "Merhaba Dünya" };
console.log(main(testInput));

export { main };`,
  
  sh: `#!/bin/bash

# Script başlığı ve açıklama
# Kullanım: ./script.sh

set -e  # Hata durumunda çık

main() {
    local input_data="$1"
    
    # Script kodunuzu buraya yazın
    echo "Processing: $input_data"
    
    # Sonuç döndür
    echo "success"
}

# Ana fonksiyonu çağır
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi`,
  
  sql: `-- Script başlığı ve açıklama
-- Veritabanı: [Veritabanı adı]
-- Amaç: [Script amacı]

-- Ana sorgu
SELECT 
    column1,
    column2,
    COUNT(*) as total
FROM 
    your_table
WHERE 
    condition = 'value'
GROUP BY 
    column1, column2
ORDER BY 
    total DESC;

-- İsteğe bağlı: Sonuç kontrolü
-- SELECT 'Script başarıyla tamamlandı' as status;`,
};

export function CreateScriptDialog({ open, onOpenChange }) {
  const { theme } = useTheme();
  const createScriptMutation = useCreateScript();
  
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    subcategory: "",
    description: "",
    version: "1.0.0",
    author: "",
    file_extension: "py",
    content: DEFAULT_TEMPLATES.py,
    input_schema: "{}",
    output_schema: "{}",
    test_input_params: "{}",
    test_output_params: "{}"
  });

  const [activeTab, setActiveTab] = useState("basic");

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Dosya uzantısı değiştiğinde template'i güncelle
    if (field === "file_extension" && DEFAULT_TEMPLATES[value]) {
      setFormData(prev => ({
        ...prev,
        content: DEFAULT_TEMPLATES[value]
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim() || !formData.category || !formData.content.trim()) {
      return;
    }

    try {
      await createScriptMutation.mutateAsync(formData);
      onOpenChange(false);
      resetForm();
    } catch (error) {
      // Hata toast hook tarafından işleniyor
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      subcategory: "",
      description: "",
      version: "1.0.0",
      author: "",
      file_extension: "py",
      content: DEFAULT_TEMPLATES.py,
      input_schema: "{}",
      output_schema: "{}",
      test_input_params: "{}",
      test_output_params: "{}"
    });
    setActiveTab("basic");
  };

  const selectedExtension = FILE_EXTENSIONS.find(ext => ext.value === formData.file_extension);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Code2 className="w-5 h-5" />
            Yeni Script Oluştur
          </DialogTitle>
          <DialogDescription>
            Workflow automation için yeni bir script oluşturun
          </DialogDescription>
        </DialogHeader>

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
                      <HelpTooltip content="Benzersiz script adı (örn: csv_processor)" />
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
              disabled={createScriptMutation.isPending}
            >
              İptal
            </Button>
            <Button
              type="submit"
              disabled={createScriptMutation.isPending || !formData.name.trim() || !formData.category || !formData.content.trim()}
            >
              {createScriptMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Oluşturuluyor...
                </>
              ) : (
                "Script Oluştur"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}