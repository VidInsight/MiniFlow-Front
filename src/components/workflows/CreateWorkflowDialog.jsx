import { useState } from "react";
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
import { useCreateWorkflow } from "@/hooks/useWorkflows";
import { Loader2 } from "lucide-react";

const workflowSchema = z.object({
  name: z.string().min(1, "Workflow adı gereklidir").max(100, "Workflow adı 100 karakterden fazla olamaz"),
  description: z.string().optional(),
  priority: z.number().min(1).max(10).default(5),
});

export function CreateWorkflowDialog({ open, onOpenChange }) {
  const createWorkflow = useCreateWorkflow();
  
  const form = useForm({
    resolver: zodResolver(workflowSchema),
    defaultValues: {
      name: "",
      description: "",
      priority: 5,
    },
  });

  const onSubmit = async (data) => {
    try {
      await createWorkflow.mutateAsync(data);
      form.reset();
      onOpenChange(false);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Yeni Workflow Oluştur</DialogTitle>
          <DialogDescription>
            Yeni bir otomasyon workflow'u oluşturun. Temel bilgileri girdikten sonra workflow editörde detayları yapılandırabilirsiniz.
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
                        max={10}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>En Düşük (1)</span>
                        <span>Orta (5)</span>
                        <span>En Yüksek (10)</span>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={createWorkflow.isPending}
              >
                İptal
              </Button>
              <Button
                type="submit"
                disabled={createWorkflow.isPending}
              >
                {createWorkflow.isPending && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                Workflow Oluştur
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}