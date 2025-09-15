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
import { toast } from '@/hooks/use-toast';
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
if [[ "\${BASH_SOURCE[0]}" == "\${0}" ]]; then
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
  
  console.log('CreateScriptDialog rendered, mutation state:', {
    isPending: createScriptMutation.isPending,
    isError: createScriptMutation.isError,
    error: createScriptMutation.error
  });
  
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
    
    console.log('🚀 Form submitted!');
    console.log('📝 Form data:', formData);
    
    // Validation with user feedback
    if (!formData.name.trim()) {
      console.log('❌ Name validation failed');
      toast({
        title: "Validation Hatası",
        description: "Script adı zorunludur.",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.category) {
      console.log('❌ Category validation failed');
      toast({
        title: "Validation Hatası", 
        description: "Kategori seçimi zorunludur.",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.content.trim()) {
      console.log('❌ Content validation failed');
      toast({
        title: "Validation Hatası",
        description: "Script içeriği zorunludur.",
        variant: "destructive", 
      });
      return;
    }

    console.log('✅ All validations passed');

    // Validate JSON syntax only
    const jsonFields = ['input_schema', 'output_schema', 'test_input_params', 'test_output_params'];
    for (const field of jsonFields) {
      if (formData[field] && formData[field].trim()) {
        try {
          JSON.parse(formData[field]);
        } catch (e) {
          toast({
            title: "JSON Syntax Hatası",
            description: `${field} alanında geçersiz JSON: ${e.message}`,
            variant: "destructive",
          });
          return;
        }
      }
    }

    // Prepare data - minimal required fields first
    const submitData = {
      name: formData.name.trim(),
      category: formData.category,
      content: formData.content.trim(),
      file_extension: formData.file_extension || "py"
    };

    // Add optional fields only if they exist
    if (formData.subcategory?.trim()) {
      submitData.subcategory = formData.subcategory.trim();
    }
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

    console.log('📤 Sending to API:', submitData);

    try {
      const result = await createScriptMutation.mutateAsync(submitData);
      console.log('🎉 Script creation successful:', result);
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error('💥 Script creation failed!');
      console.error('Error object:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      
      let errorMessage = "Beklenmeyen bir hata oluştu.";
      
      if (error.response?.status === 422) {
        console.log('📋 422 Validation Error Details:');
        const errorData = error.response?.data;
        console.log('Full error data:', errorData);
        
        if (errorData?.detail) {
          console.log('Detail:', errorData.detail);
          if (Array.isArray(errorData.detail)) {
            errorMessage = errorData.detail.map(err => {
              console.log('Validation error:', err);
              return `${err.loc ? err.loc.join('.') : 'Field'}: ${err.msg || err.message || 'Invalid value'}`;
            }).join('\n');
          } else {
            errorMessage = errorData.detail;
          }
        } else if (errorData?.message) {
          errorMessage = errorData.message;
        } else {
          errorMessage = "Veri doğrulama hatası. Console'u kontrol edin.";
        }
      } else {
        errorMessage = error.response?.data?.message || error.message || errorMessage;
      }
      
      toast({
        title: "Script Oluşturma Hatası (422)",
        description: errorMessage,
        variant: "destructive",
      });
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
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => handleInputChange("category", e.target.value)}
                      placeholder="data_processing, communication, automation..."
                      required
                    />
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
                      Girdi Şeması (JSON Schema)
                      <HelpTooltip content="Script'in girdi verisini validate etmek için JSON Schema formatında tanım" />
                    </Label>
                    <Textarea
                      value={formData.input_schema}
                      onChange={(e) => handleInputChange("input_schema", e.target.value)}
                      placeholder={JSON.stringify({
                        "type": "object",
                        "properties": {
                          "name": {
                            "type": "string",
                            "minLength": 1
                          },
                          "age": {
                            "type": "integer",
                            "minimum": 0
                          }
                        },
                        "required": ["name"]
                      }, null, 2)}
                      className="font-mono text-sm min-h-32"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      Çıktı Şeması (JSON Schema)
                      <HelpTooltip content="Script'in döneceği sonucun validate edilmesi için JSON Schema formatında tanım" />
                    </Label>
                    <Textarea
                      value={formData.output_schema}
                      onChange={(e) => handleInputChange("output_schema", e.target.value)}
                      placeholder={JSON.stringify({
                        "type": "object",
                        "properties": {
                          "status": {
                            "type": "string",
                            "enum": ["success", "error"]
                          },
                          "data": {
                            "type": "object"
                          }
                        },
                        "required": ["status"]
                      }, null, 2)}
                      className="font-mono text-sm min-h-32"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      Test Girdi Verileri
                      <HelpTooltip content="Script testinde kullanılacak gerçek örnek veri" />
                    </Label>
                    <Textarea
                      value={formData.test_input_params}
                      onChange={(e) => handleInputChange("test_input_params", e.target.value)}
                      placeholder={JSON.stringify({
                        "name": "John Doe",
                        "age": 30,
                        "email": "john@example.com"
                      }, null, 2)}
                      className="font-mono text-sm min-h-32"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      Beklenen Test Sonucu
                      <HelpTooltip content="Test girdi verileri için beklenen çıktı sonucu" />
                    </Label>
                    <Textarea
                      value={formData.test_output_params}
                      onChange={(e) => handleInputChange("test_output_params", e.target.value)}
                      placeholder={JSON.stringify({
                        "status": "success",
                        "data": {
                          "processed_name": "JOHN DOE",
                          "is_adult": true
                        }
                      }, null, 2)}
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