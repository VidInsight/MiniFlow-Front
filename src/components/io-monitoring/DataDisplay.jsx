import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronDown, ChevronRight, Copy, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';

const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('tr-TR');
};

const JsonViewer = ({ data, level = 0 }) => {
  const [expandedKeys, setExpandedKeys] = useState(new Set());

  if (data === null) return <span className="text-muted-foreground">null</span>;
  if (data === undefined) return <span className="text-muted-foreground">undefined</span>;
  
  if (typeof data !== 'object') {
    return (
      <span className={cn(
        typeof data === 'string' && 'text-green-600',
        typeof data === 'number' && 'text-blue-600',
        typeof data === 'boolean' && 'text-purple-600'
      )}>
        {typeof data === 'string' ? `"${data}"` : String(data)}
      </span>
    );
  }

  if (Array.isArray(data)) {
    if (data.length === 0) return <span className="text-muted-foreground">[]</span>;
    
    return (
      <div>
        <span className="text-muted-foreground">[</span>
        <div className="ml-4">
          {data.map((item, index) => (
            <div key={index} className="flex gap-2">
              <span className="text-muted-foreground">{index}:</span>
              <JsonViewer data={item} level={level + 1} />
            </div>
          ))}
        </div>
        <span className="text-muted-foreground">]</span>
      </div>
    );
  }

  const keys = Object.keys(data);
  if (keys.length === 0) return <span className="text-muted-foreground">{'{}'}</span>;

  const toggleExpanded = (key) => {
    const newExpanded = new Set(expandedKeys);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedKeys(newExpanded);
  };

  return (
    <div>
      <span className="text-muted-foreground">{'{'}</span>
      <div className="ml-4">
        {keys.map((key) => {
          const value = data[key];
          const isObject = typeof value === 'object' && value !== null;
          const isExpanded = expandedKeys.has(key);
          
          return (
            <div key={key} className="flex flex-col">
              <div className="flex items-center gap-1">
                {isObject && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0"
                    onClick={() => toggleExpanded(key)}
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-3 h-3" />
                    ) : (
                      <ChevronRight className="w-3 h-3" />
                    )}
                  </Button>
                )}
                {!isObject && <div className="w-4" />}
                <span className="text-blue-400">"{key}"</span>
                <span className="text-muted-foreground">:</span>
                {!isObject && <JsonViewer data={value} level={level + 1} />}
              </div>
              {isObject && isExpanded && (
                <div className="ml-4">
                  <JsonViewer data={value} level={level + 1} />
                </div>
              )}
            </div>
          );
        })}
      </div>
      <span className="text-muted-foreground">{'}'}</span>
    </div>
  );
};

export const DataDisplay = ({ data, type = 'input' }) => {
  const [showRawData, setShowRawData] = useState(false);

  if (!data) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent className="text-center p-6">
          <div className="text-muted-foreground">
            Detay görüntülemek için bir {type === 'input' ? 'input' : 'output'} seçin
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleCopyData = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(data.data, null, 2));
      toast({
        title: "Kopyalandı",
        description: "Veri panoya kopyalandı"
      });
    } catch (error) {
      toast({
        title: "Hata",
        description: "Veri kopyalanırken hata oluştu",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>{type === 'input' ? 'Input' : 'Output'} Detayları</span>
            <Badge variant={type === 'input' ? 'secondary' : (data.success ? 'default' : 'destructive')}>
              {data.data_type}
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowRawData(!showRawData)}
            >
              {showRawData ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showRawData ? 'Formatted' : 'Raw'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyData}
            >
              <Copy className="w-4 h-4" />
              Kopyala
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Metadata */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">ID:</span>
            <div className="text-muted-foreground font-mono">{data.id}</div>
          </div>
          <div>
            <span className="font-medium">Execution ID:</span>
            <div className="text-muted-foreground font-mono">{data.execution_id}</div>
          </div>
          <div>
            <span className="font-medium">Node ID:</span>
            <div className="text-muted-foreground">{data.node_id}</div>
          </div>
          <div>
            <span className="font-medium">Boyut:</span>
            <div className="text-muted-foreground">{formatSize(data.size_bytes)}</div>
          </div>
          {type === 'output' && (
            <>
              <div>
                <span className="font-medium">Durum:</span>
                <Badge className="ml-2" variant={data.success ? 'default' : 'destructive'}>
                  {data.success ? 'Başarılı' : 'Başarısız'}
                </Badge>
              </div>
              <div>
                <span className="font-medium">Süre:</span>
                <div className="text-muted-foreground">{data.execution_duration_ms}ms</div>
              </div>
            </>
          )}
          <div>
            <span className="font-medium">Checksum:</span>
            <div className="text-muted-foreground font-mono text-xs">{data.checksum}</div>
          </div>
        </div>

        {/* Error message for failed outputs */}
        {type === 'output' && data.error_message && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
            <div className="font-medium text-destructive mb-1">Hata:</div>
            <div className="text-sm text-destructive">{data.error_message}</div>
          </div>
        )}

        {/* Data display */}
        <div>
          <div className="font-medium mb-2">Veri:</div>
          <ScrollArea className="h-64 w-full border rounded-md p-3">
            <div className="font-mono text-sm">
              {showRawData ? (
                <pre className="whitespace-pre-wrap">
                  {JSON.stringify(data.data, null, 2)}
                </pre>
              ) : (
                <JsonViewer data={data.data} />
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Metadata display */}
        {data.metadata && (
          <div>
            <div className="font-medium mb-2">Metadata:</div>
            <ScrollArea className="h-32 w-full border rounded-md p-3">
              <div className="font-mono text-sm">
                <JsonViewer data={data.metadata} />
              </div>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
};