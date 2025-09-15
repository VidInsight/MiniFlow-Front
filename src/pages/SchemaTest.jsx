import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useScript } from "@/hooks/useScripts";
import { 
  Database, 
  TestTube, 
  FileText, 
  ArrowRight, 
  ArrowLeft,
  Loader2,
  Code2,
  Settings2
} from "lucide-react";

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
      {title && <h4 className="text-sm font-medium">{title}</h4>}
      <div className="border rounded-lg p-4 bg-muted/50">
        <pre className="text-sm font-mono overflow-auto max-h-96 whitespace-pre-wrap">
          <code>{jsonString}</code>
        </pre>
      </div>
    </div>
  );
};

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

export default function SchemaTest() {
  const [searchParams] = useSearchParams();
  const scriptId = searchParams.get('scriptId');
  const [activeTab, setActiveTab] = useState("input-schema");

  const { data: scriptData, isLoading } = useScript(scriptId);
  const script = scriptData?.data;

  if (!scriptId) {
    return (
      <div className="container mx-auto py-8">
        <PageHeader
          title="Schema & Test Parameters"
          description="View script schemas and test parameters"
        />
        <Card className="mt-6">
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Script Selected</h3>
              <p className="text-muted-foreground">
                Please select a script to view its schema and test parameters.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <PageHeader
          title="Schema & Test Parameters"
          description="Loading script data..."
        />
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin mr-2" />
          <span>Loading script details...</span>
        </div>
      </div>
    );
  }

  if (!script) {
    return (
      <div className="container mx-auto py-8">
        <PageHeader
          title="Schema & Test Parameters"
          description="Script not found"
        />
        <Card className="mt-6">
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Script Not Found</h3>
              <p className="text-muted-foreground">
                The requested script could not be found.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <PageHeader
        title="Schema & Test Parameters"
        description="Detailed view of script schemas and test parameters"
      />
      
      {/* Script Info Header */}
      <Card className="mt-6 mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Code2 className="w-5 h-5" />
            <span className="font-mono">{script.name}</span>
            {getExtensionBadge(script.file_extension)}
            {getCategoryBadge(script.category)}
          </CardTitle>
          <CardDescription className="flex items-center gap-4">
            <span>ID: {script.id}</span>
            <Separator orientation="vertical" className="h-4" />
            <span>Version: {script.version}</span>
            {script.author && (
              <>
                <Separator orientation="vertical" className="h-4" />
                <span>Author: {script.author}</span>
              </>
            )}
          </CardDescription>
        </CardHeader>
        {script.description && (
          <CardContent>
            <p className="text-muted-foreground">{script.description}</p>
          </CardContent>
        )}
      </Card>

      {/* Tabs for different sections */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="input-schema" className="flex items-center gap-2">
            <ArrowRight className="w-4 h-4" />
            Input Schema
          </TabsTrigger>
          <TabsTrigger value="output-schema" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Output Schema
          </TabsTrigger>
          <TabsTrigger value="test-input" className="flex items-center gap-2">
            <TestTube className="w-4 h-4" />
            Test Input
          </TabsTrigger>
          <TabsTrigger value="test-output" className="flex items-center gap-2">
            <Settings2 className="w-4 h-4" />
            Test Output
          </TabsTrigger>
        </TabsList>

        <TabsContent value="input-schema">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Input Schema
              </CardTitle>
              <CardDescription>
                Defines the structure and validation rules for script input parameters
              </CardDescription>
            </CardHeader>
            <CardContent>
              {script.input_schema && JSON.stringify(script.input_schema) !== "{}" ? (
                <JsonViewer data={script.input_schema} />
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No input schema defined for this script.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="output-schema">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Output Schema
              </CardTitle>
              <CardDescription>
                Defines the structure and format of the script's output data
              </CardDescription>
            </CardHeader>
            <CardContent>
              {script.output_schema && JSON.stringify(script.output_schema) !== "{}" ? (
                <JsonViewer data={script.output_schema} />
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No output schema defined for this script.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="test-input">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="w-5 h-5" />
                Test Input Parameters
              </CardTitle>
              <CardDescription>
                Sample input parameters used for testing the script functionality
              </CardDescription>
            </CardHeader>
            <CardContent>
              {script.test_input_params && JSON.stringify(script.test_input_params) !== "{}" ? (
                <JsonViewer data={script.test_input_params} />
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <TestTube className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No test input parameters defined for this script.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="test-output">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings2 className="w-5 h-5" />
                Test Output Parameters
              </CardTitle>
              <CardDescription>
                Expected output parameters when running the script with test inputs
              </CardDescription>
            </CardHeader>
            <CardContent>
              {script.test_output_params && JSON.stringify(script.test_output_params) !== "{}" ? (
                <JsonViewer data={script.test_output_params} />
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Settings2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No test output parameters defined for this script.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}