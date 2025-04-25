import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { FileText, ExternalLink, ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Papers() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch all papers
  const { data: papers, isLoading } = useQuery({
    queryKey: ['/api/papers'],
  });
  
  const breadcrumbItems = [
    { label: "Research Papers", active: true }
  ];
  
  // Filter papers based on search query
  const filteredPapers = !papers ? [] : papers.filter((paper: any) => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      paper.title.toLowerCase().includes(query) ||
      paper.authors.toLowerCase().includes(query) ||
      paper.abstract?.toLowerCase().includes(query) ||
      paper.concepts?.some((c: string) => c.toLowerCase().includes(query))
    );
  });
  
  return (
    <div>
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Research Papers</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Summaries and explanations of important papers in semi-supervised and self-supervised learning
        </p>
      </div>
      
      <div className="mb-8 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
        <Input 
          type="text" 
          placeholder="Search papers by title, author, or concept..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      
      {isLoading ? (
        <div className="space-y-6">
          {Array(3).fill(0).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-28 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {filteredPapers.length > 0 ? (
            <div className="space-y-6">
              {filteredPapers.map((paper: any) => (
                <Card key={paper.id} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-primary" />
                        {paper.title}
                      </CardTitle>
                      <Badge variant="outline">
                        {paper.year} {paper.conference}
                      </Badge>
                    </div>
                    <CardDescription>
                      {paper.authors.split(',').length > 3 
                        ? `${paper.authors.split(',').slice(0, 1).join(',')} et al.`
                        : paper.authors
                      }
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                      {paper.abstract && paper.abstract.length > 300 
                        ? `${paper.abstract.substring(0, 300)}...` 
                        : paper.abstract
                      }
                    </p>
                    
                    {paper.concepts && paper.concepts.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {paper.concepts.map((concept: string) => (
                          <Badge key={concept} variant="secondary" className="capitalize">
                            {concept.replace(/-/g, ' ')}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Link href={`/paper/${paper.id}`}>
                      <Button>
                        Read Summary <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    
                    {paper.link && (
                      <a href={paper.link} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline">
                          Original Paper <ExternalLink className="ml-2 h-4 w-4" />
                        </Button>
                      </a>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto text-slate-400 mb-4" />
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">No papers found</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                We couldn't find any papers matching your search criteria.
              </p>
              <Button variant="outline" onClick={() => setSearchQuery("")} className="mx-auto">
                Clear Search
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
