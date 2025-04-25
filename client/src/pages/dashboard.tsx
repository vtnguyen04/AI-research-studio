import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area, ScatterChart, Scatter, ZAxis, BarChart, Bar } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "next-themes";
import { 
  BarChart3,
  LineChart as LineChartIcon,
  AreaChart as AreaChartIcon,
  ScatterChart as ScatterChartIcon,
  Upload,
  Database,
  Download
} from "lucide-react";

// Sample metrics data for the dashboard
// In a real application, this would come from the API
const METRICS_DATA = {
  trainingHistory: [
    { epoch: 1, accuracy: 0.45, loss: 2.3, val_accuracy: 0.44, val_loss: 2.2 },
    { epoch: 5, accuracy: 0.56, loss: 1.8, val_accuracy: 0.55, val_loss: 1.7 },
    { epoch: 10, accuracy: 0.67, loss: 1.4, val_accuracy: 0.65, val_loss: 1.3 },
    { epoch: 15, accuracy: 0.75, loss: 1.1, val_accuracy: 0.73, val_loss: 1.0 },
    { epoch: 20, accuracy: 0.80, loss: 0.9, val_accuracy: 0.78, val_loss: 0.85 },
    { epoch: 25, accuracy: 0.84, loss: 0.8, val_accuracy: 0.82, val_loss: 0.75 },
    { epoch: 30, accuracy: 0.87, loss: 0.7, val_accuracy: 0.85, val_loss: 0.65 },
    { epoch: 35, accuracy: 0.90, loss: 0.6, val_accuracy: 0.88, val_loss: 0.6 },
    { epoch: 40, accuracy: 0.92, loss: 0.5, val_accuracy: 0.91, val_loss: 0.55 },
    { epoch: 45, accuracy: 0.93, loss: 0.4, val_accuracy: 0.93, val_loss: 0.5 },
    { epoch: 50, accuracy: 0.94, loss: 0.35, val_accuracy: 0.94, val_loss: 0.45 }
  ],
  // Sample embeddings for visualization
  embeddings: Array(100).fill(0).map((_, i) => ({
    x: Math.random() * 10 - 5,
    y: Math.random() * 10 - 5,
    z: Math.random() * 10,
    class: Math.floor(Math.random() * 5)
  })),
  // Method comparison
  methodComparison: [
    { name: 'Supervised', accuracy: 83.32 },
    { name: 'Pseudo-Label', accuracy: 85.22 },
    { name: 'Mean Teacher', accuracy: 89.64 },
    { name: 'UDA', accuracy: 91.18 },
    { name: 'FixMatch', accuracy: 94.93 }
  ]
};

export default function Dashboard() {
  const { theme } = useTheme();
  const [datasetOption, setDatasetOption] = useState("cifar10");
  const [modelOption, setModelOption] = useState("wideresnet");
  const [chartType, setChartType] = useState("line");
  const [metric, setMetric] = useState("accuracy");
  
  // Fetch experiment data
  // In a real application, this would fetch data based on selected options
  const { data: metricsData, isLoading } = useQuery({
    queryKey: ['/api/dashboard/metrics', datasetOption, modelOption],
    // Since we're using mock data, no real API call is needed
    placeholderData: METRICS_DATA,
    staleTime: 60 * 1000, // 1 minute
  });
  
  const breadcrumbItems = [
    { label: "Training Dashboard", active: true }
  ];
  
  // Generate colors for embedding visualization
  const embedColors = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];
  
  return (
    <div>
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Training Dashboard</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Visualize training metrics, compare methods, and explore model performance
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Dataset</CardTitle>
            <CardDescription>Select the dataset to visualize</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={datasetOption} onValueChange={setDatasetOption}>
              <SelectTrigger>
                <SelectValue placeholder="Select dataset" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cifar10">CIFAR-10</SelectItem>
                <SelectItem value="cifar100">CIFAR-100</SelectItem>
                <SelectItem value="imagenet">ImageNet</SelectItem>
                <SelectItem value="custom">Custom Dataset</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Model</CardTitle>
            <CardDescription>Select the model architecture</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={modelOption} onValueChange={setModelOption}>
              <SelectTrigger>
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="wideresnet">WideResNet-28-2</SelectItem>
                <SelectItem value="resnet50">ResNet-50</SelectItem>
                <SelectItem value="efficientnet">EfficientNet-B0</SelectItem>
                <SelectItem value="vit">Vision Transformer</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Upload Data</CardTitle>
            <CardDescription>Upload your own dataset</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              Upload Dataset
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="training">
        <TabsList className="mb-6">
          <TabsTrigger value="training">Training Metrics</TabsTrigger>
          <TabsTrigger value="embeddings">Embedding Visualization</TabsTrigger>
          <TabsTrigger value="comparison">Method Comparison</TabsTrigger>
        </TabsList>
        
        <TabsContent value="training">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Metric</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={metric} onValueChange={setMetric}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select metric" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="accuracy">Accuracy</SelectItem>
                    <SelectItem value="loss">Loss</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Chart Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <Button 
                    variant={chartType === "line" ? "default" : "outline"} 
                    size="icon"
                    onClick={() => setChartType("line")}
                  >
                    <LineChartIcon className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant={chartType === "area" ? "default" : "outline"} 
                    size="icon"
                    onClick={() => setChartType("area")}
                  >
                    <AreaChartIcon className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                  <Button variant="outline" size="sm">
                    <Database className="h-4 w-4 mr-2" />
                    Save Model
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Training Progress</CardTitle>
              <CardDescription>
                {metric === "accuracy" 
                  ? "Model accuracy over training epochs" 
                  : "Loss values over training epochs"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[400px] w-full" />
              ) : (
                <div className="h-[400px] w-full">
                  {chartType === "line" ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={metricsData?.trainingHistory}
                        margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke={theme === "dark" ? "#374151" : "#e5e7eb"} />
                        <XAxis 
                          dataKey="epoch" 
                          label={{ value: 'Epoch', position: 'insideBottomRight', offset: -10 }}
                          stroke={theme === "dark" ? "#9ca3af" : "#6b7280"}
                        />
                        <YAxis 
                          label={{ 
                            value: metric === "accuracy" ? 'Accuracy' : 'Loss', 
                            angle: -90, 
                            position: 'insideLeft',
                            style: { textAnchor: 'middle' }
                          }}
                          stroke={theme === "dark" ? "#9ca3af" : "#6b7280"}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
                            borderColor: theme === "dark" ? "#374151" : "#e5e7eb",
                            color: theme === "dark" ? "#f9fafb" : "#111827"
                          }} 
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey={metric}
                          name={metric === "accuracy" ? "Training Accuracy" : "Training Loss"}
                          stroke="hsl(var(--primary))" 
                          activeDot={{ r: 8 }} 
                          strokeWidth={2}
                        />
                        <Line 
                          type="monotone" 
                          dataKey={`val_${metric}`}
                          name={metric === "accuracy" ? "Validation Accuracy" : "Validation Loss"}
                          stroke="hsl(var(--secondary))" 
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={metricsData?.trainingHistory}
                        margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke={theme === "dark" ? "#374151" : "#e5e7eb"} />
                        <XAxis 
                          dataKey="epoch" 
                          label={{ value: 'Epoch', position: 'insideBottomRight', offset: -10 }}
                          stroke={theme === "dark" ? "#9ca3af" : "#6b7280"}
                        />
                        <YAxis 
                          label={{ 
                            value: metric === "accuracy" ? 'Accuracy' : 'Loss', 
                            angle: -90, 
                            position: 'insideLeft',
                            style: { textAnchor: 'middle' }
                          }}
                          stroke={theme === "dark" ? "#9ca3af" : "#6b7280"}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
                            borderColor: theme === "dark" ? "#374151" : "#e5e7eb",
                            color: theme === "dark" ? "#f9fafb" : "#111827"
                          }} 
                        />
                        <Legend />
                        <Area 
                          type="monotone" 
                          dataKey={metric}
                          name={metric === "accuracy" ? "Training Accuracy" : "Training Loss"}
                          stroke="hsl(var(--primary))" 
                          fill="hsla(var(--primary), 0.2)"
                          strokeWidth={2}
                        />
                        <Area 
                          type="monotone" 
                          dataKey={`val_${metric}`}
                          name={metric === "accuracy" ? "Validation Accuracy" : "Validation Loss"}
                          stroke="hsl(var(--secondary))" 
                          fill="hsla(var(--secondary), 0.2)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="embeddings">
          <Card>
            <CardHeader>
              <CardTitle>Embedding Visualization</CardTitle>
              <CardDescription>
                t-SNE visualization of feature embeddings by class
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[400px] w-full" />
              ) : (
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart
                      margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke={theme === "dark" ? "#374151" : "#e5e7eb"} />
                      <XAxis 
                        dataKey="x" 
                        type="number" 
                        name="t-SNE 1" 
                        stroke={theme === "dark" ? "#9ca3af" : "#6b7280"}
                        domain={[-6, 6]}
                      />
                      <YAxis 
                        dataKey="y" 
                        type="number" 
                        name="t-SNE 2" 
                        stroke={theme === "dark" ? "#9ca3af" : "#6b7280"}
                        domain={[-6, 6]}
                      />
                      <ZAxis 
                        dataKey="z" 
                        range={[20, 200]} 
                        name="score" 
                      />
                      <Tooltip 
                        cursor={{ strokeDasharray: '3 3' }}
                        contentStyle={{ 
                          backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
                          borderColor: theme === "dark" ? "#374151" : "#e5e7eb",
                          color: theme === "dark" ? "#f9fafb" : "#111827"
                        }} 
                        formatter={(value: any, name: any) => [value.toFixed(2), name]}
                      />
                      <Legend />
                      {[0, 1, 2, 3, 4].map(classId => (
                        <Scatter 
                          key={classId}
                          name={`Class ${classId}`} 
                          data={metricsData?.embeddings.filter((d: any) => d.class === classId)}
                          fill={embedColors[classId]}
                        />
                      ))}
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="comparison">
          <Card>
            <CardHeader>
              <CardTitle>Method Comparison</CardTitle>
              <CardDescription>
                Comparison of different semi-supervised learning methods on CIFAR-10
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[400px] w-full" />
              ) : (
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={metricsData?.methodComparison}
                      margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke={theme === "dark" ? "#374151" : "#e5e7eb"} />
                      <XAxis 
                        dataKey="name" 
                        stroke={theme === "dark" ? "#9ca3af" : "#6b7280"}
                        angle={-45}
                        textAnchor="end"
                        height={70}
                      />
                      <YAxis 
                        label={{ 
                          value: 'Accuracy (%)', 
                          angle: -90, 
                          position: 'insideLeft',
                          style: { textAnchor: 'middle' }
                        }}
                        stroke={theme === "dark" ? "#9ca3af" : "#6b7280"}
                        domain={[80, 100]}
                      />
                      <Tooltip 
                        formatter={(value: any) => [`${value.toFixed(2)}%`, 'Accuracy']}
                        contentStyle={{ 
                          backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
                          borderColor: theme === "dark" ? "#374151" : "#e5e7eb",
                          color: theme === "dark" ? "#f9fafb" : "#111827"
                        }} 
                      />
                      <Bar 
                        dataKey="accuracy" 
                        fill="hsl(var(--primary))"
                        background={{ fill: theme === "dark" ? "#374151" : "#f3f4f6" }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
