import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEnvironmentVariable, useUpdateEnvironmentVariable } from "@/hooks/useEnvironment";
import { Loader2 } from "lucide-react";

const environmentSchema = z.object({
  name: z.string().min(1, "Değişken adı gereklidir").max(100, "Değişken adı 100 karakterden fazla olamaz"),
  value: z.string().optional(),
  description: z.string().optional(),
  variable_type: z.enum(["STRING", "INTEGER", "FLOAT", "BOOLEAN", "URL", "JSON", "FILE_PATH", "SECRET"]),
  scope: z.enum(["GLOBAL", "WORKFLOW", "EXECUTION"]),
});

export function EditEnvironmentDialog({ open, onOpenChange, envarId }) {
  const { data: envar, isLoading } = useEnvironmentVariable(envarId);
  const updateEnvironmentVariable = useUpdateEnvironmentVariable();
  
  const form = useForm({
    resolver: zodResolver(environmentSchema),
    defaultValues: {
      name: "",
      value: "",
      description: "",
      variable_type: "STRING",
      scope: "GLOBAL",
    },
  });

  const watchVariableType = form.watch("variable_type");

  useEffect(() => {
    if (envar?.data) {
      form.reset({
        name: envar.data.name || "",
        value: envar.data.value || "",
        description: envar.data.description || "",
        variable_type: envar.data.variable_type || "STRING",
        scope: envar.data.scope || "GLOBAL",
      });
    }
  }, [envar, form]);

  const onSubmit = async (data) => {
    try {
      await updateEnvironmentVariable.mutateAsync({ envarId, data });
      onOpenChange(false);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Ortam Değişkeni Düzenle</DialogTitle>
          <DialogDescription>
            Ortam değişkeni bilgilerini güncelleyin
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Değişken Adı *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="DATABASE_URL"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="variable_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tür</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Tür seçin" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="STRING">String</SelectItem>
                        <SelectItem value="INTEGER">Integer</SelectItem>
                        <SelectItem value="FLOAT">Float</SelectItem>
                        <SelectItem value="BOOLEAN">Boolean</SelectItem>
                        <SelectItem value="URL">URL</SelectItem>
                        <SelectItem value="JSON">JSON</SelectItem>
                        <SelectItem value="FILE_PATH">Dosya Yolu</SelectItem>
                        <SelectItem value="SECRET">Gizli</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Değer</FormLabel>
                  <FormControl>
                    <Input
                      type={watchVariableType === "SECRET" ? "password" : "text"}
                      placeholder="Değer girin"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Açıklama</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Bu değişkenin amacını açıklayın"
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="scope"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kapsam</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Kapsam seçin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="GLOBAL">Global</SelectItem>
                      <SelectItem value="WORKFLOW">Workflow</SelectItem>
                      <SelectItem value="EXECUTION">Execution</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={updateEnvironmentVariable.isPending}
              >
                İptal
              </Button>
              <Button
                type="submit"
                disabled={updateEnvironmentVariable.isPending}
              >
                {updateEnvironmentVariable.isPending && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                Değişiklikleri Kaydet
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}