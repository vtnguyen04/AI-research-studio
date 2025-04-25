import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, FileCode, Github, Lightbulb, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { CodeBlock } from "@/components/ui/code-block";

export default function Implementation() {
  const [activeTab, setActiveTab] = useState("all");
  
  // Fetch all concepts
  const { data: concepts, isLoading: isLoadingConcepts } = useQuery({
    queryKey: ['/api/concepts'],
  });
  
  // For real implementation, we'd need to fetch all code implementations
  // For now, we'll use sample data from storage.ts
  const { data: pythonImplementation, isLoading: isLoadingPython } = useQuery({
    queryKey: ['/api/code/1'],
    enabled: !!concepts,
  });
  
  const breadcrumbItems = [
    { label: "Code Implementations", active: true }
  ];
  
  return (
    <div>
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Code Implementations</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Practical code examples for implementing key algorithms and techniques
        </p>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList>
          <TabsTrigger value="all">All Languages</TabsTrigger>
          <TabsTrigger value="python">Python</TabsTrigger>
          <TabsTrigger value="cpp">C++</TabsTrigger>
          <TabsTrigger value="jupyter">Jupyter Notebooks</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {isLoadingConcepts || isLoadingPython ? (
        <div className="space-y-8">
          {Array(2).fill(0).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {/* Show different code implementations based on tab */}
          {(activeTab === "all" || activeTab === "python") && pythonImplementation?.map((impl: any) => (
            <Card key={impl.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <FileCode className="h-5 w-5 mr-2 text-primary" />
                    {impl.title}
                  </CardTitle>
                  <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900 text-primary">
                    Python
                  </Badge>
                </div>
                <CardDescription className="flex items-center">
                  <Lightbulb className="h-4 w-4 mr-1 text-slate-400" />
                  <span>
                    {concepts.find((c: any) => c.id === impl.conceptId)?.title || "Unknown Concept"}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  {impl.description}
                </p>
                <CodeBlock 
                  code={impl.code.slice(0, 400) + "..."}
                  language="python"
                  title="Preview"
                />
              </CardContent>
              <CardFooter>
                <Link href={`/concept/${concepts.find((c: any) => c.id === impl.conceptId)?.slug || "#"}?tab=implementation`}>
                  <Button className="w-full">
                    View Full Implementation <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
          
          {activeTab === "all" && !pythonImplementation?.length && (
            <div className="text-center py-8">
              <FileCode className="h-12 w-12 mx-auto text-slate-400 mb-4" />
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">No code implementations found</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                We couldn't find any code implementations matching your criteria.
              </p>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="mx-auto">
                  <Github className="mr-2 h-4 w-4" />
                  Contribute on GitHub
                </Button>
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
