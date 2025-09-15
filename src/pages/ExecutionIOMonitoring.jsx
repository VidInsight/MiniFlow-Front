import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Settings, RefreshCw, Activity } from 'lucide-react';
import { InputCircle } from '@/components/io-monitoring/InputCircle';
import { OutputCircle } from '@/components/io-monitoring/OutputCircle';
import { DataDisplay } from '@/components/io-monitoring/DataDisplay';
import { useExecutionInputs, useExecutionInput } from '@/hooks/useExecutionInputs';
import { useExecutionOutputs, useExecutionOutput } from '@/hooks/useExecutionOutputs';
import { cn } from '@/lib/utils';

const ExecutionIOMonitoring = () => {
  const [selectedInputId, setSelectedInputId] = useState(null);
  const [selectedOutputId, setSelectedOutputId] = useState(null);

  // Data fetching
  const { 
    data: inputsData, 
    isLoading: inputsLoading, 
    refetch: refetchInputs 
  } = useExecutionInputs({}, { refetchInterval: 5000 });

  const { 
    data: outputsData, 
    isLoading: outputsLoading, 
    refetch: refetchOutputs 
  } = useExecutionOutputs({}, { refetchInterval: 5000 });

  const { data: selectedInputData } = useExecutionInput(selectedInputId);
  const { data: selectedOutputData } = useExecutionOutput(selectedOutputId);

  // Event handlers
  const handleInputSelect = (input) => {
    setSelectedInputId(input.id);
    setSelectedOutputId(null); // Clear output selection
  };

  const handleOutputSelect = (output) => {
    setSelectedOutputId(output.id);
    setSelectedInputId(null); // Clear input selection
  };

  const handleRefresh = () => {
    refetchInputs();
    refetchOutputs();
  };

  const inputs = inputsData?.data?.items || [];
  const outputs = outputsData?.data?.items || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Execution I/O Monitoring"
        description="Workflow execution input ve output verilerini gerçek zamanlı izleyin"
        icon={Activity}
        actions={[
          <button
            key="refresh"
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Yenile
          </button>
        ]}
      />

      {/* Main Content - Three Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
        {/* Left Column - Input Circles */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-lg border p-4 h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Inputs</h3>
              <div className="text-sm text-muted-foreground">
                {inputs.length} item
              </div>
            </div>
            
            <ScrollArea className="h-[500px]">
              <div className="space-y-4">
                {inputsLoading ? (
                  // Loading skeletons
                  Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex justify-center">
                      <Skeleton className="w-16 h-16 rounded-full" />
                    </div>
                  ))
                ) : inputs.length === 0 ? (
                  // Empty state
                  <div className="text-center text-muted-foreground py-8">
                    <div className="text-sm">Henüz input verisi yok</div>
                  </div>
                ) : (
                  // Input circles
                  inputs.map((input) => (
                    <div key={input.id} className="flex justify-center">
                      <InputCircle
                        input={input}
                        isSelected={selectedInputId === input.id}
                        onClick={handleInputSelect}
                      />
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Center Column - Engine Symbol & Data Display */}
        <div className="lg:col-span-8">
          <div className="bg-card rounded-lg border h-full">
            {/* Engine Symbol */}
            <div className="flex items-center justify-center py-6 border-b">
              <div className={cn(
                "relative w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10",
                "flex items-center justify-center border-2 border-primary/30",
                "animate-pulse"
              )}>
                <Settings className="w-8 h-8 text-primary animate-spin" style={{
                  animationDuration: '3s'
                }} />
                
                {/* Connection lines */}
                <div className="absolute -left-12 top-1/2 w-12 h-0.5 bg-gradient-to-r from-transparent to-primary/50" />
                <div className="absolute -right-12 top-1/2 w-12 h-0.5 bg-gradient-to-l from-transparent to-primary/50" />
              </div>
            </div>

            {/* Data Display */}
            <div className="p-6 h-[calc(100%-120px)]">
              <DataDisplay
                data={selectedInputData?.data || selectedOutputData?.data}
                type={selectedInputId ? 'input' : 'output'}
              />
            </div>
          </div>
        </div>

        {/* Right Column - Output Circles */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-lg border p-4 h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Outputs</h3>
              <div className="text-sm text-muted-foreground">
                {outputs.length} item
              </div>
            </div>
            
            <ScrollArea className="h-[500px]">
              <div className="space-y-4">
                {outputsLoading ? (
                  // Loading skeletons
                  Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex justify-center">
                      <Skeleton className="w-16 h-16 rounded-full" />
                    </div>
                  ))
                ) : outputs.length === 0 ? (
                  // Empty state
                  <div className="text-center text-muted-foreground py-8">
                    <div className="text-sm">Henüz output verisi yok</div>
                  </div>
                ) : (
                  // Output circles
                  outputs.map((output) => (
                    <div key={output.id} className="flex justify-center">
                      <OutputCircle
                        output={output}
                        isSelected={selectedOutputId === output.id}
                        onClick={handleOutputSelect}
                      />
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutionIOMonitoring;