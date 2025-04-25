import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Lightbulb, Shapes } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Theory() {
  // Fetch all concepts
  const { data: concepts, isLoading } = useQuery({
    queryKey: ['/api/concepts'],
  });
  
  const breadcrumbItems = [
    { label: "Theory Pages", active: true }
  ];
  
  return (
    <div>
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Theory & Explanation Pages</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Deep dive into the mathematical foundations and principles of modern AI techniques
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          // Skeleton Loading State
          Array(6).fill(0).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="h-2 bg-slate-200 dark:bg-slate-700" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-16 w-full mb-4" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))
        ) : (
          // Display concepts
          concepts?.map(concept => (
            <Card key={concept.id} className="overflow-hidden">
              <div className={`h-2 ${concept.category === 'semi-supervised' ? 'bg-primary' : 'bg-secondary'}`} />
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    {concept.category === 'semi-supervised' ? (
                      <Lightbulb className="h-5 w-5 mr-2 text-primary" />
                    ) : (
                      <Shapes className="h-5 w-5 mr-2 text-secondary" />
                    )}
                    {concept.title}
                  </CardTitle>
                  <Badge variant="outline">
                    {concept.category === 'semi-supervised' ? 'Semi-Supervised' : 'Self-Supervised'}
                  </Badge>
                </div>
                <CardDescription>
                  Last updated: {new Date(concept.updatedAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-400">
                  {concept.description}
                </p>
              </CardContent>
              <CardFooter>
                <Link href={`/concept/${concept.slug}`}>
                  <Button className="w-full">
                    Read More <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
