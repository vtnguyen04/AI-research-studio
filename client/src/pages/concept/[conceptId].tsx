import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { CodeBlock } from "@/components/ui/code-block";
import { LatexMarkdown } from "@/components/ui/latex";
import { ExperimentSetup } from "@/components/ui/experiment-setup";
import {
  Share,
  FileEdit,
  ArrowUpRight,
  ChevronRight,
  Code,
  FileText,
  FlaskRound,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { useTheme } from "next-themes";

interface ConceptPageProps {
  conceptId: string;
}

export default function ConceptPage({ conceptId }: ConceptPageProps) {
  const [location] = useLocation();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<string>("theory");

  // Extract tab from URL if present
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get("tab");
    if (
      tabParam &&
      ["theory", "implementation", "experiments", "papers"].includes(tabParam)
    ) {
      setActiveTab(tabParam);
    }
  }, []);

  // Fetch concept data
  const { data, isLoading, error } = useQuery({
    queryKey: [`/api/concepts/${conceptId}`],
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

  if (error || !data) {
    return (
      <Card className="my-8">
        <CardContent className="pt-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-500 mb-4">
              Error Loading Concept
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              We couldn't load the concept you're looking for. It may not exist
              or there was a server error.
            </p>
            <Button asChild>
              <a href="/">Return Home</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { concept, theory, codeImplementations, experiments } = data;

  const breadcrumbItems = [
    { label: "Core Concepts", href: "/theory" },
    {
      label:
        concept.category === "semi-supervised"
          ? "Semi-Supervised Learning"
          : "Self-Supervised Learning",
      href: `/theory?category=${concept.category}`,
    },
    { label: concept.title, active: true },
  ];

  return (
    <div>
      <Breadcrumb items={breadcrumbItems} />

      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
              {concept.title}
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Last updated: {new Date(concept.updatedAt).toLocaleDateString()}
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <Button variant="outline" className="flex items-center">
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button className="flex items-center">
              <FileEdit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="mb-8 border-b border-slate-200 dark:border-slate-700">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <a
            href="#theory"
            className={`border-b-2 whitespace-nowrap py-4 px-1 font-medium text-sm ${
              activeTab === "theory"
                ? "border-primary text-primary dark:text-primary"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300"
            }`}
            onClick={(e) => {
              e.preventDefault();
              setActiveTab("theory");
            }}
          >
            Theory
          </a>
          <a
            href="#implementation"
            className={`border-b-2 whitespace-nowrap py-4 px-1 font-medium text-sm ${
              activeTab === "implementation"
                ? "border-primary text-primary dark:text-primary"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300"
            }`}
            onClick={(e) => {
              e.preventDefault();
              setActiveTab("implementation");
            }}
          >
            Implementation
          </a>
          <a
            href="#experiments"
            className={`border-b-2 whitespace-nowrap py-4 px-1 font-medium text-sm ${
              activeTab === "experiments"
                ? "border-primary text-primary dark:text-primary"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300"
            }`}
            onClick={(e) => {
              e.preventDefault();
              setActiveTab("experiments");
            }}
          >
            Experiments
          </a>
          <a
            href="#papers"
            className={`border-b-2 whitespace-nowrap py-4 px-1 font-medium text-sm ${
              activeTab === "papers"
                ? "border-primary text-primary dark:text-primary"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300"
            }`}
            onClick={(e) => {
              e.preventDefault();
              setActiveTab("papers");
            }}
          >
            Related Papers
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div>
        {/* Theory Tab */}
        {activeTab === "theory" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content Column */}
            <div className="lg:col-span-2 space-y-6">
              {theory ? (
                <LatexMarkdown content={theory.content} />
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-12">
                      <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        No Theory Content Available
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 mb-6">
                        This concept doesn't have any theory content yet.
                      </p>
                      <Button variant="outline">
                        Contribute Theory Content
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Table of Contents */}
              <div className="bg-white dark:bg-card rounded-lg shadow-sm p-6 sticky top-20">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-card-foreground mb-4">
                  On This Page
                </h3>
                <nav className="space-y-3">
                  <a
                    href="#introduction"
                    className="block text-sm text-primary font-medium hover:text-blue-700 dark:hover:text-blue-300"
                  >
                    Introduction
                  </a>
                  <a
                    href="#mathematical-foundations"
                    className="block text-sm text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary"
                  >
                    Mathematical Foundations
                  </a>
                  <a
                    href="#modern-techniques"
                    className="block text-sm text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary"
                  >
                    Modern Techniques
                  </a>
                  <a
                    href="#applications"
                    className="block text-sm text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary"
                  >
                    Applications
                  </a>
                  <a
                    href="#limitations"
                    className="block text-sm text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary"
                  >
                    Limitations and Challenges
                  </a>
                  <a
                    href="#research-papers"
                    className="block text-sm text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary"
                  >
                    Key Research Papers
                  </a>
                </nav>

                <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-card-foreground mb-4">
                    Related Concepts
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {concept.category === "semi-supervised" ? (
                      <>
                        <a
                          href="/concept/self-supervised-learning"
                          className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-primary dark:hover:text-primary"
                        >
                          Self-Supervised Learning
                        </a>
                        <a
                          href="#"
                          className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-primary dark:hover:text-primary"
                        >
                          Consistency Regularization
                        </a>
                        <a
                          href="#"
                          className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-primary dark:hover:text-primary"
                        >
                          Pseudo-Labeling
                        </a>
                      </>
                    ) : (
                      <>
                        <a
                          href="/concept/semi-supervised-learning"
                          className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-primary dark:hover:text-primary"
                        >
                          Semi-Supervised Learning
                        </a>
                        <a
                          href="#"
                          className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-primary dark:hover:text-primary"
                        >
                          Contrastive Learning
                        </a>
                        <a
                          href="#"
                          className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-primary dark:hover:text-primary"
                        >
                          Representation Learning
                        </a>
                      </>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-card-foreground mb-4">
                    Learning Resources
                  </h3>
                  <ul className="space-y-3">
                    <li>
                      <a
                        href="#"
                        className="flex items-center text-sm text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-2 text-slate-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253"
                          />
                        </svg>
                        Survey Paper (2020)
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="flex items-center text-sm text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-2 text-slate-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                        Video Tutorial (Stanford)
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="flex items-center text-sm text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-2 text-slate-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                          />
                        </svg>
                        GitHub Repository
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Implementation Tab */}
        {activeTab === "implementation" && (
          <div className="space-y-8">
            {codeImplementations && codeImplementations.length > 0 ? (
              codeImplementations.map((impl: any) => (
                <Card key={impl.id} className="overflow-hidden">
                  <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2 text-primary"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                          />
                        </svg>
                        {impl.title}
                      </h2>
                      <Badge
                        variant="outline"
                        className={
                          impl.language === "python"
                            ? "bg-blue-50 dark:bg-blue-900 text-primary"
                            : "bg-purple-50 dark:bg-purple-900 text-secondary"
                        }
                      >
                        {impl.language}
                      </Badge>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                      {impl.description}
                    </p>
                  </div>
                  <div className="p-0">
                    <CodeBlock
                      code={impl.code}
                      language={impl.language.toLowerCase()}
                      title={`${impl.title} (${impl.language})`}
                    />
                  </div>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 mx-auto text-slate-400 mb-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                      />
                    </svg>
                    <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      No Implementations Available
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                      This concept doesn't have any code implementations yet.
                    </p>
                    <Button variant="outline">
                      Contribute Code Implementation
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Experiments Tab */}
        {activeTab === "experiments" && (
          <div className="space-y-8">
            {experiments && experiments.length > 0 ? (
              experiments.map((experiment: any) => (
                <Card key={experiment.id} className="overflow-hidden">
                  <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-2 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                        />
                      </svg>
                      {experiment.title}
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                      {experiment.description}
                    </p>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
                          Training Progress
                        </h3>
                        <div className="h-64 border border-slate-200 dark:border-slate-700 rounded-md p-4">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                              data={experiment.metrics.epochs.map(
                                (epoch: number, index: number) => ({
                                  epoch,
                                  accuracy:
                                    experiment.metrics.train_accuracy[index],
                                  val_accuracy:
                                    experiment.metrics.val_accuracy[index],
                                }),
                              )}
                              margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                              }}
                            >
                              <CartesianGrid
                                strokeDasharray="3 3"
                                stroke={
                                  theme === "dark" ? "#374151" : "#e5e7eb"
                                }
                              />
                              <XAxis
                                dataKey="epoch"
                                label={{
                                  value: "Epoch",
                                  position: "insideBottomRight",
                                  offset: -10,
                                }}
                                stroke={
                                  theme === "dark" ? "#9ca3af" : "#6b7280"
                                }
                              />
                              <YAxis
                                label={{
                                  value: "Accuracy (%)",
                                  angle: -90,
                                  position: "insideLeft",
                                  style: { textAnchor: "middle" },
                                }}
                                stroke={
                                  theme === "dark" ? "#9ca3af" : "#6b7280"
                                }
                              />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor:
                                    theme === "dark" ? "#1f2937" : "#ffffff",
                                  borderColor:
                                    theme === "dark" ? "#374151" : "#e5e7eb",
                                  color:
                                    theme === "dark" ? "#f9fafb" : "#111827",
                                }}
                              />
                              <Legend />
                              <Line
                                type="monotone"
                                dataKey="accuracy"
                                name="Training Accuracy"
                                stroke="hsl(var(--primary))"
                                activeDot={{ r: 8 }}
                              />
                              <Line
                                type="monotone"
                                dataKey="val_accuracy"
                                name="Validation Accuracy"
                                stroke="hsl(var(--secondary))"
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
                          Key Results
                        </h3>

                        <div className="space-y-4">
                          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-md">
                            <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                              Final Accuracy
                            </div>
                            <div className="text-2xl font-bold text-primary">
                              {experiment.results.accuracy}%
                            </div>
                          </div>

                          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-md">
                            <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                              Error Rate
                            </div>
                            <div className="text-2xl font-bold text-destructive">
                              {experiment.results.error_rate}%
                            </div>
                          </div>

                          {experiment.results.comparison && (
                            <div>
                              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2">
                                Comparison with other methods
                              </h4>
                              <ul className="space-y-2">
                                {Object.entries(
                                  experiment.results.comparison,
                                ).map(([method, accuracy]: [string, any]) => (
                                  <li
                                    key={method}
                                    className="flex items-center justify-between text-sm"
                                  >
                                    <span className="capitalize">
                                      {method.replace("_", " ")}
                                    </span>
                                    <span
                                      className={`font-semibold ${method === "fixmatch" ? "text-primary" : "text-slate-700 dark:text-slate-300"}`}
                                    >
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
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
                          Experimental Setup
                        </h3>
                        <div className="prose dark:prose-invert max-w-none">
                          <pre className="whitespace-pre-wrap bg-slate-50 dark:bg-slate-800 p-4 rounded-md text-sm">
                            {experiment.setup}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 mx-auto text-slate-400 mb-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                      />
                    </svg>
                    <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      No Experiments Available
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                      This concept doesn't have any experiments yet.
                    </p>
                    <Button variant="outline">Request an Experiment</Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Related Papers Tab */}
        {activeTab === "papers" && (
          <div className="space-y-6">
            {/* Fetch papers related to this concept */}
            {concept && concept.category === "semi-supervised" ? (
              <>
                <Card className="overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2 text-primary"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        FixMatch: Simplifying Semi-Supervised Learning with
                        Consistency and Confidence
                      </h2>
                      <Badge variant="outline">2020 NeurIPS</Badge>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                      Kihyuk Sohn, David Berthelot, et al.
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                      Semi-supervised learning (SSL) provides an effective means
                      to leverage unlabeled data to improve a model's
                      performance. In this paper, we demonstrate the power of a
                      simple combination of two common SSL methods: consistency
                      regularization and pseudo-labeling.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="secondary">
                        semi-supervised-learning
                      </Badge>
                      <Badge variant="secondary">
                        consistency-regularization
                      </Badge>
                      <Badge variant="secondary">pseudo-labeling</Badge>
                    </div>
                    <div className="flex space-x-4">
                      <Button asChild>
                        <a href="/paper/1">
                          Read Summary <ChevronRight className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                      <Button variant="outline" asChild>
                        <a
                          href="https://arxiv.org/abs/2001.07685"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Original Paper{" "}
                          <ArrowUpRight className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </Card>

                <Card className="overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2 text-primary"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        A Realistic Evaluation of Semi-Supervised Learning
                        Algorithms
                      </h2>
                      <Badge variant="outline">2018 NeurIPS</Badge>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                      Avital Oliver, Augustus Odena, et al.
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                      This paper provides a thorough evaluation of
                      semi-supervised learning methods, comparing their
                      effectiveness under different conditions and highlighting
                      important factors for their success.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="secondary">
                        semi-supervised-learning
                      </Badge>
                      <Badge variant="secondary">evaluation</Badge>
                    </div>
                    <div className="flex space-x-4">
                      <Button variant="outline" asChild>
                        <a
                          href="https://arxiv.org/abs/1804.09170"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Original Paper{" "}
                          <ArrowUpRight className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </Card>
              </>
            ) : (
              <>
                <Card className="overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2 text-primary"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        Bootstrap Your Own Latent: A New Approach to
                        Self-Supervised Learning
                      </h2>
                      <Badge variant="outline">2020 NeurIPS</Badge>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                      Jean-Bastien Grill, Florian Strub, et al.
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                      We introduce Bootstrap Your Own Latent (BYOL), a new
                      approach to self-supervised image representation learning.
                      BYOL relies on two neural networks, referred to as online
                      and target networks, that interact and learn from each
                      other.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="secondary">
                        self-supervised-learning
                      </Badge>
                      <Badge variant="secondary">representation-learning</Badge>
                    </div>
                    <div className="flex space-x-4">
                      <Button asChild>
                        <a href="/paper/2">
                          Read Summary <ChevronRight className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                      <Button variant="outline" asChild>
                        <a
                          href="https://arxiv.org/abs/2006.07733"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Original Paper{" "}
                          <ArrowUpRight className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </Card>

                <Card className="overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2 text-primary"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        A Simple Framework for Contrastive Learning of Visual
                        Representations
                      </h2>
                      <Badge variant="outline">2020 ICML</Badge>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                      Ting Chen, Simon Kornblith, et al.
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                      This paper presents SimCLR: a simple framework for
                      contrastive learning of visual representations. We
                      simplify recently proposed contrastive self-supervised
                      learning algorithms without requiring specialized
                      architectures or a memory bank.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="secondary">
                        self-supervised-learning
                      </Badge>
                      <Badge variant="secondary">contrastive-learning</Badge>
                    </div>
                    <div className="flex space-x-4">
                      <Button asChild>
                        <a href="/paper/3">
                          Read Summary <ChevronRight className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                      <Button variant="outline" asChild>
                        <a
                          href="https://arxiv.org/abs/2002.05709"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Original Paper{" "}
                          <ArrowUpRight className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </Card>
              </>
            )}
          </div>
        )}
      </div>

      {/* Related Topics Section */}
      <section className="mt-12">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-6">
          Explore Related Topics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Related Topic Card 1 */}
          <div className="bg-white dark:bg-card rounded-lg shadow-sm overflow-hidden border border-slate-200 dark:border-slate-700 transition-all hover:shadow-md">
            <div className="h-3 bg-secondary"></div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
                {concept.category === "semi-supervised"
                  ? "Self-Supervised Learning"
                  : "Semi-Supervised Learning"}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                {concept.category === "semi-supervised"
                  ? "Learn how to train models using automatically generated supervision signals from the data itself."
                  : "Discover how to leverage both labeled and unlabeled data to build better models."}
              </p>
              <a
                href={
                  concept.category === "semi-supervised"
                    ? "/concept/self-supervised-learning"
                    : "/concept/semi-supervised-learning"
                }
                className="text-sm font-medium text-primary hover:text-blue-700 dark:hover:text-blue-300"
              >
                Explore topic →
              </a>
            </div>
          </div>

          {/* Related Topic Card 2 */}
          <div className="bg-white dark:bg-card rounded-lg shadow-sm overflow-hidden border border-slate-200 dark:border-slate-700 transition-all hover:shadow-md">
            <div className="h-3 bg-accent"></div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
                Contrastive Learning
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Discover how to train representations by contrasting positive
                and negative pairs of samples.
              </p>
              <a
                href="#"
                className="text-sm font-medium text-primary hover:text-blue-700 dark:hover:text-blue-300"
              >
                Explore topic →
              </a>
            </div>
          </div>

          {/* Related Topic Card 3 */}
          <div className="bg-white dark:bg-card rounded-lg shadow-sm overflow-hidden border border-slate-200 dark:border-slate-700 transition-all hover:shadow-md">
            <div className="h-3 bg-primary"></div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
                Data Augmentation
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Explore techniques to artificially expand your dataset and
                improve model generalization.
              </p>
              <a
                href="#"
                className="text-sm font-medium text-primary hover:text-blue-700 dark:hover:text-blue-300"
              >
                Explore topic →
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}