import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CodeBlockProps {
  code: string;
  language: string;
  title?: string;
  showLineNumbers?: boolean;
  fileName?: string;
  showActions?: boolean;
  className?: string;
}

export function CodeBlock({
  code,
  language,
  title,
  showLineNumbers = true,
  fileName,
  showActions = true,
  className = "",
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const preRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    const loadPrism = async () => {
      try {
        // Add Prism CSS
        const style = document.createElement('link');
        style.href = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.24.1/themes/prism-tomorrow.min.css';
        style.rel = 'stylesheet';
        document.head.appendChild(style);

        // Load Prism core
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.24.1/components/prism-core.min.js';
        document.head.appendChild(script);

        // Load language support
        const langScript = document.createElement('script');
        langScript.src = `https://cdnjs.cloudflare.com/ajax/libs/prism/1.24.1/components/prism-${language}.min.js`;
        document.head.appendChild(langScript);

        // Wait for scripts to load
        await new Promise(resolve => script.onload = resolve);
        await new Promise(resolve => langScript.onload = resolve);

        // Highlight code
        if (window.Prism && preRef.current) {
          window.Prism.highlightElement(preRef.current.querySelector('code'));
        }
      } catch (error) {
        console.error('Prism loading error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPrism();
  }, [language, code]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return <Skeleton className="h-32 w-full" />;
  }

  return (
    <div className={cn("relative group rounded-lg overflow-hidden", className)}>
      <pre ref={preRef} className="p-4 overflow-x-auto">
        <code className={`language-${language}`}>{code}</code>
      </pre>

      {showActions && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 w-8 p-0"
                  onClick={copyToClipboard}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{copied ? "Copied!" : "Copy code"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 w-8 p-0"
                  onClick={() => {
                    const extension = language === "javascript" ? "js" : language;
                    const fileNameToUse = fileName || `code-snippet.${extension}`;
                    const blob = new Blob([code], { type: "text/plain" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = fileNameToUse;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download code</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </div>
  );
}