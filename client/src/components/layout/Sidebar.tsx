// src/components/layout/Sidebar.tsx

import { Link, useLocation } from "wouter"; // Keep wouter imports
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
// NOTE: useMobile seems specific to your old structure, you might need the new SidebarProvider context if using the component library version
// import { useMobile } from "@/hooks/use-mobile";
import {
  PlusIcon,
  Lightbulb,
  Code,
  FlaskRound,
  FileText,
  BarChart3,
  Home,
  Shapes,
  X, // Added for close button
  ChevronDown, // Added for dropdown indicator
} from "lucide-react";
import { useState } from "react";

// --- MODIFIED SidebarItem ---
interface SidebarItemProps {
  icon: React.ReactNode;
  href: string;
  children: React.ReactNode;
  active?: boolean;
}

function SidebarItem({ icon, href, children, active }: SidebarItemProps) {
  return (
    <li className="group">
      {/* Apply className directly to wouter's Link */}
      <Link
        href={href}
        className={cn(
          "flex items-center px-3 py-2 text-sm font-medium rounded-md", // Styles moved here
          active
            ? "bg-blue-50 text-primary dark:bg-sidebar-accent dark:text-sidebar-primary"
            : "text-slate-700 hover:bg-blue-50 hover:text-primary dark:text-sidebar-foreground dark:hover:bg-sidebar-accent dark:hover:text-sidebar-primary",
        )}
      >
        {/* Icon and children are direct descendants */}
        <div className="h-5 w-5 mr-2">{icon}</div>
        {children}
        {/* Removed the inner <a> tag */}
      </Link>
    </li>
  );
}

// --- Main Sidebar Component ---
export function Sidebar() {
  const [location] = useLocation();
  // Assuming you might still need basic mobile state if not using the full provider component
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768; // Simple mobile check example
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Fetch concepts for the sidebar
  const { data: concepts } = useQuery({
    queryKey: ["/api/concepts"],
    staleTime: 60 * 1000, // 1 minute
  });

  const semiSupervisedConcepts =
    concepts?.filter((c: any) => c.category === "semi-supervised") || [];
  const selfSupervisedConcepts =
    concepts?.filter((c: any) => c.category === "self-supervised") || [];

  // Fetch papers for the sidebar
  const { data: papers } = useQuery({
    queryKey: ["/api/papers"],
    staleTime: 60 * 1000, // 1 minute
  });

  const recentPapers = papers?.slice(0, 3) || [];

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden" // Ensure hidden on larger screens
          onClick={toggleMobileMenu}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={cn(
          "bg-white dark:bg-sidebar-background border-r border-slate-200 dark:border-sidebar-border w-64 fixed inset-y-0 left-0 overflow-y-auto transition-transform duration-300 ease-in-out z-30",
          // Mobile specific translate
          isMobile
            ? mobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full"
            : "translate-x-0", // Always visible on desktop
        )}
        aria-hidden={isMobile && !mobileMenuOpen} // Better accessibility
      >
        <div className="p-4 border-b border-slate-200 dark:border-sidebar-border">
          <div className="flex items-center justify-between">
            <h1 className="font-bold text-xl text-slate-800 dark:text-sidebar-foreground">
              AI Research Hub
            </h1>
            {/* Show close button only on mobile when menu is open */}
            {isMobile && mobileMenuOpen && (
              <button
                onClick={toggleMobileMenu}
                className="text-slate-500 hover:text-primary dark:text-sidebar-foreground dark:hover:text-sidebar-primary"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            )}
          </div>
        </div>

        <nav className="p-4 flex flex-col flex-grow">
          {/* Main Navigation */}
          <div className="mb-4">
            <ul className="mt-2 space-y-1">
              <SidebarItem
                icon={<Home size={20} />}
                href="/"
                active={location === "/"}
              >
                Home
              </SidebarItem>
              {/* Add other main items using SidebarItem */}
            </ul>
          </div>

          {/* Core Concepts */}
          <div className="mb-4">
            <h2 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
              Core Concepts
            </h2>

            <div className="space-y-1">
              {" "}
              {/* Reduced space */}
              {/* Semi-Supervised Section */}
              <div>
                <button
                  onClick={() =>
                    setActiveCategory(
                      activeCategory === "semi-supervised"
                        ? null
                        : "semi-supervised",
                    )
                  }
                  className={cn(
                    "flex items-center w-full px-3 py-2 text-sm font-medium rounded-md", // Shared button styles
                    activeCategory === "semi-supervised"
                      ? "bg-blue-50 text-primary dark:bg-sidebar-accent dark:text-sidebar-primary" // Active styles
                      : "text-slate-700 hover:bg-blue-50 hover:text-primary dark:text-sidebar-foreground dark:hover:bg-sidebar-accent dark:hover:text-sidebar-primary", // Inactive styles
                  )}
                  aria-expanded={activeCategory === "semi-supervised"} // Accessibility
                >
                  <Lightbulb className="h-5 w-5 mr-2" />
                  <span>Semi-Supervised Learning</span>
                  <ChevronDown
                    className={cn(
                      "ml-auto h-5 w-5 transition-transform",
                      activeCategory === "semi-supervised" ? "rotate-180" : "",
                    )}
                  />
                </button>

                {activeCategory === "semi-supervised" &&
                  semiSupervisedConcepts.length > 0 && (
                    <ul className="pt-1 pl-6 space-y-1">
                      {" "}
                      {/* Adjusted padding */}
                      {semiSupervisedConcepts.map((concept: any) => (
                        <li key={concept.id}>
                          {/* --- MODIFIED Concept Link --- */}
                          <Link
                            href={`/concept/${concept.slug}`}
                            className="block text-sm text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-sidebar-primary py-1 pl-2 rounded-md hover:bg-blue-50 dark:hover:bg-sidebar-accent" // Apply className to Link
                          >
                            {concept.title}
                            {/* Removed inner <a> */}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
              </div>
              {/* Self-Supervised Section */}
              <div>
                <button
                  onClick={() =>
                    setActiveCategory(
                      activeCategory === "self-supervised"
                        ? null
                        : "self-supervised",
                    )
                  }
                  className={cn(
                    "flex items-center w-full px-3 py-2 text-sm font-medium rounded-md", // Shared button styles
                    activeCategory === "self-supervised"
                      ? "bg-blue-50 text-primary dark:bg-sidebar-accent dark:text-sidebar-primary" // Active styles
                      : "text-slate-700 hover:bg-blue-50 hover:text-primary dark:text-sidebar-foreground dark:hover:bg-sidebar-accent dark:hover:text-sidebar-primary", // Inactive styles
                  )}
                  aria-expanded={activeCategory === "self-supervised"} // Accessibility
                >
                  <Shapes className="h-5 w-5 mr-2" />
                  <span>Self-Supervised Learning</span>
                  <ChevronDown
                    className={cn(
                      "ml-auto h-5 w-5 transition-transform",
                      activeCategory === "self-supervised" ? "rotate-180" : "",
                    )}
                  />
                </button>

                {activeCategory === "self-supervised" &&
                  selfSupervisedConcepts.length > 0 && (
                    <ul className="pt-1 pl-6 space-y-1">
                      {" "}
                      {/* Adjusted padding */}
                      {selfSupervisedConcepts.map((concept: any) => (
                        <li key={concept.id}>
                          {/* --- MODIFIED Concept Link --- */}
                          <Link
                            href={`/concept/${concept.slug}`}
                            className="block text-sm text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-sidebar-primary py-1 pl-2 rounded-md hover:bg-blue-50 dark:hover:bg-sidebar-accent" // Apply className to Link
                          >
                            {concept.title}
                            {/* Removed inner <a> */}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
              </div>
            </div>
          </div>

          {/* Resource Types */}
          <div className="mb-4">
            <h2 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
              Resource Types
            </h2>
            <ul className="mt-2 space-y-1">
              <SidebarItem
                icon={<FileText size={20} />}
                href="/theory"
                active={location.startsWith("/theory")} // Use startsWith for sub-pages
              >
                Theory Pages
              </SidebarItem>
              <SidebarItem
                icon={<Code size={20} />}
                href="/implementation"
                active={location.startsWith("/implementation")}
              >
                Code Implementations
              </SidebarItem>
              <SidebarItem
                icon={<FlaskRound size={20} />}
                href="/experiments"
                active={location.startsWith("/experiments")}
              >
                Experiments
              </SidebarItem>
              <SidebarItem
                icon={<FileText size={20} />}
                href="/papers"
                active={location.startsWith("/papers")}
              >
                Research Papers
              </SidebarItem>
              <SidebarItem
                icon={<BarChart3 size={20} />}
                href="/dashboard"
                active={location.startsWith("/dashboard")}
              >
                Training Dashboard
              </SidebarItem>
            </ul>
          </div>

          {/* Recent Papers */}
          <div className="mb-4">
            <h2 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
              Recent Papers
            </h2>
            <ul className="mt-2 space-y-1">
              {recentPapers.map((paper: any) => (
                <li key={paper.id}>
                  {/* --- MODIFIED Paper Link --- */}
                  <Link
                    href={`/paper/${paper.id}`}
                    className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-slate-700 hover:bg-blue-50 hover:text-primary dark:text-sidebar-foreground dark:hover:bg-sidebar-accent dark:hover:text-sidebar-primary" // Apply className to Link
                    title={paper.title} // Add title attribute for full title on hover
                  >
                    {/* Content directly inside Link */}
                    {paper.title.length > 25
                      ? `${paper.title.substring(0, 25)}...`
                      : paper.title}{" "}
                    ({paper.year}){/* Removed inner <a> */}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Spacer to push button to bottom */}
          <div className="flex-grow"></div>

          {/* Contribute Button */}
          <div className="p-4 border-t border-slate-200 dark:border-sidebar-border mt-auto -mx-4 -mb-4">
            {" "}
            {/* Adjust margin/padding */}
            <Button className="w-full">
              <PlusIcon className="h-5 w-5 mr-2" />
              Contribute Content
            </Button>
          </div>
        </nav>
      </aside>
    </>
  );
}
