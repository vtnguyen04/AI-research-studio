import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { FileText, ArrowUpRight, Share, ArrowDown01, Link as LinkIcon } from "lucide-react";
import { Link } from "wouter";

interface PaperPageProps {
  paperId: string;
}

export default function PaperPage({ paperId }: PaperPageProps) {
  // Fetch paper data
  const { data: paper, isLoading, error } = useQuery({
    queryKey: [`/api/papers/${paperId}`],
  });
  
  // Handle loading and error states
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
        <div className="h-2 my-8">
          <Skeleton className="h-full w-full" />
        </div>
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }
  
  if (error || !paper) {
    return (
      <Card className="my-8">
        <CardContent className="pt-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-500 mb-4">Error Loading Paper</h1>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              We couldn't load the paper you're looking for. It may not exist or there was a server error.
            </p>
            <Button asChild>
              <a href="/">Return Home</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const breadcrumbItems = [
    { label: "Research Papers", href: "/papers" },
    { label: paper.title, active: true }
  ];
  
  return (
    <div>
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">{paper.title}</h1>
            <p className="mt-1 text-slate-500 dark:text-slate-400">
              {paper.authors}
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <Button variant="outline" className="flex items-center">
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
            {paper.link && (
              <Button asChild>
                <a href={paper.link} target="_blank" rel="noopener noreferrer" className="flex items-center">
                  <ArrowUpRight className="h-4 w-4 mr-2" />
                  Original Paper
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">Published in</div>
                    <div className="font-medium text-slate-900 dark:text-slate-50">{paper.conference} {paper.year}</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {paper.concepts?.map((concept: string) => (
                    <Badge key={concept} variant="secondary" className="capitalize">
                      {concept.replace(/-/g, ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-4">Abstract</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6 whitespace-pre-line">
                {paper.abstract}
              </p>
              
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-4">Key Points</h2>
              <div className="prose dark:prose-invert max-w-none">
                <pre className="whitespace-pre-line bg-slate-50 dark:bg-slate-800 p-4 rounded-md mb-6">
                  {paper.key_points}
                </pre>
              </div>
              
              <div className="flex space-x-4 mt-6">
                {paper.link && (
                  <Button variant="outline" asChild className="flex-1 sm:flex-none">
                    <a href={paper.link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                      <LinkIcon className="h-4 w-4 mr-2" />
                      Link to Paper
                    </a>
                  </Button>
                )}
                <Button variant="outline" className="flex-1 sm:flex-none">
                  <ArrowDown01 className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Implementation Examples Section */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-4">Implementation Examples</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Explore code implementations related to this paper's techniques.
              </p>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                    {paper.title.includes("FixMatch") ? "FixMatch Implementation" : 
                      paper.title.includes("BYOL") ? "BYOL Implementation" : 
                      "SimCLR Implementation"}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Official implementation in PyTorch
                  </p>
                </div>
                <Button asChild>
                  <a href={`/concept/${paper.concepts?.[0] || "semi-supervised-learning"}?tab=implementation`}>
                    View Code
                  </a>
                </Button>
              </div>
              
              <div className="border-t border-slate-200 dark:border-slate-700 my-6"></div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Community Implementations</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Alternative implementations and adaptations
                  </p>
                </div>
                <Button variant="outline" asChild>
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                    Browse on GitHub
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">Details</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-slate-500 dark:text-slate-400">Authors</div>
                  <div className="mt-1 text-slate-900 dark:text-slate-50">{paper.authors}</div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-slate-500 dark:text-slate-400">Year</div>
                  <div className="mt-1 text-slate-900 dark:text-slate-50">{paper.year}</div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-slate-500 dark:text-slate-400">Conference/Journal</div>
                  <div className="mt-1 text-slate-900 dark:text-slate-50">{paper.conference}</div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-slate-500 dark:text-slate-400">Related Concepts</div>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {paper.concepts?.map((concept: string) => (
                      <Link key={concept} href={`/concept/${concept}`}>
                        <a className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-primary dark:hover:text-primary capitalize">
                          {concept.replace(/-/g, ' ')}
                        </a>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">Related Papers</h3>
              
              <div className="space-y-4">
                {paper.title.includes("FixMatch") ? (
                  <>
                    <div>
                      <Link href="/paper/2">
                        <a className="text-slate-900 dark:text-slate-50 hover:text-primary dark:hover:text-primary font-medium">
                          Bootstrap Your Own Latent (2020)
                        </a>
                      </Link>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        J-B. Grill, F. Strub, et al.
                      </p>
                    </div>
                    <div>
                      <Link href="/paper/3">
                        <a className="text-slate-900 dark:text-slate-50 hover:text-primary dark:hover:text-primary font-medium">
                          A Simple Framework for Contrastive Learning of Visual Representations (2020)
                        </a>
                      </Link>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        T. Chen, S. Kornblith, et al.
                      </p>
                    </div>
                  </>
                ) : paper.title.includes("BYOL") ? (
                  <>
                    <div>
                      <Link href="/paper/1">
                        <a className="text-slate-900 dark:text-slate-50 hover:text-primary dark:hover:text-primary font-medium">
                          FixMatch: Simplifying Semi-Supervised Learning (2020)
                        </a>
                      </Link>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        K. Sohn, D. Berthelot, et al.
                      </p>
                    </div>
                    <div>
                      <Link href="/paper/3">
                        <a className="text-slate-900 dark:text-slate-50 hover:text-primary dark:hover:text-primary font-medium">
                          A Simple Framework for Contrastive Learning of Visual Representations (2020)
                        </a>
                      </Link>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        T. Chen, S. Kornblith, et al.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <Link href="/paper/1">
                        <a className="text-slate-900 dark:text-slate-50 hover:text-primary dark:hover:text-primary font-medium">
                          FixMatch: Simplifying Semi-Supervised Learning (2020)
                        </a>
                      </Link>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        K. Sohn, D. Berthelot, et al.
                      </p>
                    </div>
                    <div>
                      <Link href="/paper/2">
                        <a className="text-slate-900 dark:text-slate-50 hover:text-primary dark:hover:text-primary font-medium">
                          Bootstrap Your Own Latent (2020)
                        </a>
                      </Link>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        J-B. Grill, F. Strub, et al.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">Cite This Paper</h3>
              
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-md text-sm font-mono overflow-x-auto mb-4">
                <code className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                  {`@inproceedings{${paper.title.split(":")[0].toLowerCase().replace(/\s+/g, "")}${paper.year},
  title={${paper.title}},
  author={${paper.authors}},
  booktitle={${paper.conference}},
  year={${paper.year}}
}`}
                </code>
              </div>
              
              <Button variant="outline" className="w-full" onClick={() => {
                navigator.clipboard.writeText(`@inproceedings{${paper.title.split(":")[0].toLowerCase().replace(/\s+/g, "")}${paper.year},
  title={${paper.title}},
  author={${paper.authors}},
  booktitle={${paper.conference}},
  year={${paper.year}}
}`);
              }}>
                Copy BibTeX
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
