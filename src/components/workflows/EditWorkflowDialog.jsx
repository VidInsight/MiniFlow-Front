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
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWorkflow, useUpdateWorkflow } from "@/hooks/useWorkflows";
import { Loader2 } from "lucide-react";

const workflowSchema = z.object({
  name: z.string().min(1, "Workflow adı gereklidir").max(100, "Workflow adı 100 karakterden fazla olamaz"),
  description: z.string().optional(),
  priority: z.number().min(0).max(100),
  status: z.enum(["ACTIVE", "INACTIVE", "DRAFT"]),
});

export function EditWorkflowDialog({ open, onOpenChange, workflowId }) {
  const { data: workflow, isLoading } = useWorkflow(workflowId);
  const updateWorkflow = useUpdateWorkflow();
  
  const form = useForm({
    resolver: zodResolver(workflowSchema),
    defaultValues: {
      name: "",
      description: "",
      priority: 50,
      status: "DRAFT",
    },
  });

  useEffect(() => {
    if (workflow?.data) {
      form.reset({
        name: workflow.data.name || "",
        description: workflow.data.description || "",
        priority: workflow.data.priority || 50,
        status: workflow.data.status || "DRAFT",
      });
    }
  }, [workflow, form]);

  const onSubmit = async (data) => {
    try {
      await updateWorkflow.mutateAsync({ workflowId, data });
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
          <DialogTitle>Workflow Düzenle</DialogTitle>
          <DialogDescription>
            Workflow bilgilerini güncelleyin. Değişiklikler anında uygulanacaktır.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workflow Adı *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="örn: Veri İşleme Pipeline'ı"
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
                      placeholder="Bu workflow'un ne yaptığını açıklayın..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Öncelik Seviyesi: {field.value}</FormLabel>
                  <FormControl>
                    <div className="px-3">
                      <Slider
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                        max={100}
                        min={0}
                        step={10}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Düşük (0)</span>
                        <span>Orta (50)</span>
                        <span>Yüksek (100)</span>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Durum</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Durum seçin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Aktif</SelectItem>
                      <SelectItem value="INACTIVE">Pasif</SelectItem>
                      <SelectItem value="DRAFT">Taslak</SelectItem>
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
                disabled={updateWorkflow.isPending}
              >
                İptal
              </Button>
              <Button
                type="submit"
                disabled={updateWorkflow.isPending}
              >
                {updateWorkflow.isPending && (
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