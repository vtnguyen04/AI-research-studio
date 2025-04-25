import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Lightbulb, Code, ChevronRight, Shapes, FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  // Fetch concepts for featured section
  const { data: concepts, isLoading: isLoadingConcepts } = useQuery({
    queryKey: ['/api/concepts'],
  });
  
  // Fetch papers for recent papers section
  const { data: papers, isLoading: isLoadingPapers } = useQuery({
    queryKey: ['/api/papers'],
  });
  
  return (
    <div>
      <section className="mb-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-4">AI Research Learning Platform</h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Explore the theory and practice of modern deep learning techniques, with a focus on semi-supervised and self-supervised learning.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                <Lightbulb className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Theory & Explanations</CardTitle>
              <CardDescription>
                Deep dive into the mathematical background and intuition behind modern AI techniques
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/theory">
                <Button variant="outline" className="w-full mt-2">
                  Browse Theory Pages <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-4">
                <Code className="h-6 w-6 text-secondary" />
              </div>
              <CardTitle>Code Implementations</CardTitle>
              <CardDescription>
                Practical code examples in Python, C++, and Jupyter Notebooks with explanations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/implementation">
                <Button variant="outline" className="w-full mt-2">
                  View Code Examples <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-accent" />
              </div>
              <CardTitle>Research Papers</CardTitle>
              <CardDescription>
                Summaries and explanations of important papers with key insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/papers">
                <Button variant="outline" className="w-full mt-2">
                  Explore Papers <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
      
      {/* Featured Concepts Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Featured Concepts</h2>
          <Link href="/theory">
            <Button variant="ghost" className="text-primary">
              View All <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isLoadingConcepts ? (
            Array(2).fill(0).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-40 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full mb-4" />
                  <Skeleton className="h-8 w-32" />
                </CardContent>
              </Card>
            ))
          ) : (
            concepts?.slice(0, 2).map(concept => (
              <Card key={concept.id}>
                <CardHeader>
                  <div className="flex items-center mb-2">
                    {concept.category === 'semi-supervised' ? (
                      <Lightbulb className="h-5 w-5 mr-2 text-primary" />
                    ) : (
                      <Shapes className="h-5 w-5 mr-2 text-secondary" />
                    )}
                    <CardTitle>{concept.title}</CardTitle>
                  </div>
                  <CardDescription>
                    {concept.category === 'semi-supervised' ? 'Semi-Supervised Learning' : 'Self-Supervised Learning'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    {concept.description}
                  </p>
                  <Link href={`/concept/${concept.slug}`}>
                    <Button>
                      Learn More <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </section>
      
      {/* Recent Papers Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Recent Papers</h2>
          <Link href="/papers">
            <Button variant="ghost" className="text-primary">
              View All <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        <div className="space-y-4">
          {isLoadingPapers ? (
            Array(3).fill(0).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-full mb-2" />
                  <div className="flex items-center">
                    <Skeleton className="h-4 w-32 mr-2" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            papers?.slice(0, 3).map(paper => (
              <Card key={paper.id}>
                <CardContent className="p-4">
                  <Link href={`/paper/${paper.id}`}>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 hover:text-primary dark:hover:text-primary transition-colors">
                      {paper.title}
                    </h3>
                  </Link>
                  <div className="flex items-center mt-1 text-sm text-slate-500 dark:text-slate-400">
                    <span>
                      {paper.authors.split(',')[0]} et al.
                    </span>
                    <span className="mx-2">•</span>
                    <span>{paper.year}</span>
                    <span className="mx-2">•</span>
                    <span>{paper.conference}</span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
