import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface LatexProps {
  formula: string;
  block?: boolean;
  className?: string;
}

export function Latex({ formula, block = false, className = "" }: LatexProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    
    // Load KaTeX if it's not already loaded
    const katexLoaded = typeof (window as any).katex !== 'undefined';
    
    if (!katexLoaded) {
      const loadKatex = async () => {
        try {
          // Load KaTeX CSS
          const styleLink = document.createElement('link');
          styleLink.rel = 'stylesheet';
          styleLink.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css';
          document.head.appendChild(styleLink);
          
          // Load KaTeX JS
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js';
          script.async = true;
          script.onload = renderLatex;
          document.head.appendChild(script);
        } catch (error) {
          console.error('Error loading KaTeX:', error);
          setHasError(true);
          setIsLoading(false);
        }
      };
      
      loadKatex();
    } else {
      renderLatex();
    }
    
    function renderLatex() {
      if (containerRef.current) {
        try {
          const katex = (window as any).katex;
          if (katex) {
            katex.render(formula, containerRef.current, {
              throwOnError: false,
              displayMode: block,
              trust: true,
              strict: false,
              output: 'html',
              macros: {
                "\\f": "f(#1)"
              }
            });
          }
          setIsLoading(false);
        } catch (error) {
          console.error('Error rendering LaTeX:', error);
          if (containerRef.current) {
            containerRef.current.textContent = formula;
          }
          setHasError(true);
          setIsLoading(false);
        }
      }
    }
    
    return () => {
      setIsLoading(false);
    };
  }, [formula, block]);
  
  if (isLoading) {
    return <Skeleton className={`h-8 w-full ${block ? 'my-4' : 'inline-block w-16'}`} />;
  }
  
  if (hasError) {
    return (
      <span className="text-destructive font-mono text-sm px-1 bg-destructive/10 rounded">
        {formula}
      </span>
    );
  }
  
  return <div ref={containerRef} className={`${className} overflow-x-auto`} />;
}

// Component to render LaTeX in markdown content
export function LatexMarkdown({ content }: { content: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [processedContent, setProcessedContent] = useState(content);
  
  // Pre-process content to fix common formatting issues
  useEffect(() => {
    // Fix markdown headers that might cause LaTeX rendering issues
    let processed = content.replace(/^(#+)\s+/gm, (match, hashes) => {
      return `${hashes} `;
    });
    
    // Add proper spacing around math delimiters
    processed = processed.replace(/(\$\$)([^\n$])/g, '$1\n$2');
    processed = processed.replace(/([^\n$])(\$\$)/g, '$1\n$2');
    
    // Fix multi-line LaTeX formulas
    processed = processed.replace(/(\$\$)([\s\S]*?)(\$\$)/g, (match, open, formula, close) => {
      // Remove line breaks and extra spaces in LaTeX formulas
      const cleanFormula = formula.replace(/\s+/g, ' ').trim();
      return `${open}\n${cleanFormula}\n${close}`;
    });
    
    setProcessedContent(processed);
  }, [content]);
  
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    
    // Load KaTeX if it's not already loaded
    const katexLoaded = typeof (window as any).katex !== 'undefined';
    const autoRenderLoaded = typeof (window as any).renderMathInElement !== 'undefined';
    
    if (!katexLoaded || !autoRenderLoaded) {
      const loadKatex = async () => {
        try {
          // Load KaTeX CSS
          const styleLink = document.createElement('link');
          styleLink.rel = 'stylesheet';
          styleLink.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css';
          document.head.appendChild(styleLink);
          
          // Load KaTeX JS
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js';
          script.async = true;
          
          // Load Auto-render Extension
          script.onload = () => {
            const autoRenderScript = document.createElement('script');
            autoRenderScript.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/contrib/auto-render.min.js';
            autoRenderScript.async = true;
            autoRenderScript.onload = renderLatexInElement;
            document.head.appendChild(autoRenderScript);
          };
          
          document.head.appendChild(script);
        } catch (error) {
          console.error('Error loading KaTeX:', error);
          setHasError(true);
          setIsLoading(false);
        }
      };
      
      loadKatex();
    } else {
      renderLatexInElement();
    }
    
    function renderLatexInElement() {
      if (containerRef.current) {
        try {
          const renderMathInElement = (window as any).renderMathInElement;
          if (renderMathInElement) {
            renderMathInElement(containerRef.current, {
              delimiters: [
                {left: '$$', right: '$$', display: true},
                {left: '$', right: '$', display: false},
                {left: '\\(', right: '\\)', display: false},
                {left: '\\[', right: '\\]', display: true}
              ],
              throwOnError: false,
              trust: true,
              strict: false,
              output: 'html',
              macros: {
                "\\f": "f(#1)"
              }
            });
          }
          setIsLoading(false);
        } catch (error) {
          console.error('Error rendering LaTeX in Markdown:', error);
          setHasError(true);
          setIsLoading(false);
        }
      }
    }
    
    return () => {
      setIsLoading(false);
    };
  }, [processedContent]);
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-6 w-1/2" />
      </div>
    );
  }
  
  if (hasError) {
    return (
      <Card className="p-4 border-destructive">
        <p className="text-destructive">There was an error rendering the LaTeX content. Please check the syntax.</p>
        <pre className="mt-2 p-2 bg-destructive/10 rounded text-sm whitespace-pre-wrap overflow-x-auto">
          {processedContent}
        </pre>
      </Card>
    );
  }
  
  return (
    <div 
      ref={containerRef} 
      className="prose dark:prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: processedContent }}
    />
  );
}
