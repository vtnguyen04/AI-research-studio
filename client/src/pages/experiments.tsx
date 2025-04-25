import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { FlaskRound, LineChart, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveContainer, LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { useState, useEffect } from "react";
import { ExperimentSetup } from "@/components/ui/experiment-setup";

export default function Experiments() {
  const [activeMetric, setActiveMetric] = useState("accuracy");
  
  // Fetch all concepts
  const { data: concepts, isLoading: isLoadingConcepts } = useQuery({
    queryKey: ['/api/concepts'],
  });
  
  // Fetch experiment data for the concept with ID 1 (Semi-supervised learning)
  const { data: experiments, isLoading: isLoadingExperiments } = useQuery({
    queryKey: ['/api/experiments/1'],
    enabled: !!concepts,
  });
  
  const breadcrumbItems = [
    { label: "Experiments", active: true }
  ];
  
  // Prepare chart data
  const prepareChartData = (experiment: any) => {
    if (!experiment || !experiment.metrics) return [];
    
    const { epochs } = experiment.metrics;
    const metricKey = activeMetric === "accuracy" ? "train_accuracy" : "train_loss";
    const validationKey = activeMetric === "accuracy" ? "val_accuracy" : "val_loss";
    
    return epochs.map((epoch: number, index: number) => ({
      epoch,
      [metricKey]: experiment.metrics[metricKey][index],
      [validationKey]: experiment.metrics[validationKey][index],
    }));
  };
  
  return (
    <div>
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Experiments & Results</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Real-world experiments demonstrating the performance of various learning methods
        </p>
      </div>
      
      {isLoadingConcepts || isLoadingExperiments ? (
        <div className="space-y-8">
          {Array(2).fill(0).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {experiments?.map((experiment: any) => (
            <Card key={experiment.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <FlaskRound className="h-5 w-5 mr-2 text-primary" />
                    {experiment.title}
                  </CardTitle>
                  <Badge variant="outline">
                    {concepts.find((c: any) => c.id === experiment.conceptId)?.title || "Unknown Concept"}
                  </Badge>
                </div>
                <CardDescription>
                  {experiment.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <Tabs defaultValue="accuracy" value={activeMetric} onValueChange={setActiveMetric} className="mb-4">
                      <TabsList>
                        <TabsTrigger value="accuracy">Accuracy</TabsTrigger>
                        <TabsTrigger value="loss">Loss</TabsTrigger>
                      </TabsList>
                    </Tabs>
                    
                    <div className="h-64 border border-slate-200 dark:border-slate-700 rounded-md p-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsLineChart
                          data={prepareChartData(experiment)}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" strokeOpacity={0.2} />
                          <XAxis dataKey="epoch" label={{ value: 'Epoch', position: 'insideBottomRight', offset: -10 }} />
                          <YAxis 
                            label={{ 
                              value: activeMetric === "accuracy" ? 'Accuracy (%)' : 'Loss', 
                              angle: -90, 
                              position: 'insideLeft',
                              style: { textAnchor: 'middle' }
                            }} 
                          />
                          <Tooltip />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey={activeMetric === "accuracy" ? "train_accuracy" : "train_loss"} 
                            name={activeMetric === "accuracy" ? "Training Accuracy" : "Training Loss"}
                            stroke="hsl(var(--primary))" 
                            activeDot={{ r: 8 }} 
                          />
                          <Line 
                            type="monotone" 
                            dataKey={activeMetric === "accuracy" ? "val_accuracy" : "val_loss"} 
                            name={activeMetric === "accuracy" ? "Validation Accuracy" : "Validation Loss"}
                            stroke="hsl(var(--secondary))" 
                          />
                        </RechartsLineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
                      Key Results
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-md">
                        <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Final Accuracy</div>
                        <div className="text-2xl font-bold text-primary">{experiment.results.accuracy}%</div>
                      </div>
                      
                      <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-md">
                        <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Error Rate</div>
                        <div className="text-2xl font-bold text-destructive">{experiment.results.error_rate}%</div>
                      </div>
                      
                      {experiment.results.comparison && (
                        <div>
                          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2">
                            Comparison with other methods
                          </h4>
                          <ul className="space-y-2">
                            {Object.entries(experiment.results.comparison).map(([method, accuracy]: [string, any]) => (
                              <li key={method} className="flex items-center justify-between text-sm">
                                <span className="capitalize">{method.replace('_', ' ')}</span>
                                <span className={`font-semibold ${method === 'fixmatch' ? 'text-primary' : 'text-slate-700 dark:text-slate-300'}`}>
                                  {accuracy}%
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {experiment.setup && (
                  <div className="mt-6">
                    <ExperimentSetup setup={experiment.setup} />
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Link href={`/concept/${concepts.find((c: any) => c.id === experiment.conceptId)?.slug || "#"}?tab=experiments`}>
                  <Button className="w-full">
                    View Full Details <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
          
          {experiments?.length === 0 && (
            <div className="text-center py-8">
              <FlaskRound className="h-12 w-12 mx-auto text-slate-400 mb-4" />
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">No experiments found</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                We couldn't find any experiments matching your criteria.
              </p>
              <Button variant="outline" className="mx-auto">
                Request an Experiment
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
