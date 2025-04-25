import { useState } from "react";
import { cn } from "@/lib/utils";
import { Link } from "wouter";

export interface TabItem {
  label: string;
  href: string;
  active?: boolean;
}

interface ContentTabsProps {
  tabs: TabItem[];
  onChange?: (index: number) => void;
}

export function ContentTabs({ tabs, onChange }: ContentTabsProps) {
  const [activeTab, setActiveTab] = useState(() => {
    const initialActiveIndex = tabs.findIndex(tab => tab.active);
    return initialActiveIndex !== -1 ? initialActiveIndex : 0;
  });

  const handleTabChange = (index: number) => {
    setActiveTab(index);
    if (onChange) {
      onChange(index);
    }
  };

  return (
    <div className="mb-8 border-b border-slate-200 dark:border-slate-700">
      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
        {tabs.map((tab, index) => (
          <Link 
            key={index} 
            href={tab.href}
            onClick={() => handleTabChange(index)}
          >
            <a 
              className={cn(
                "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm",
                activeTab === index 
                  ? "border-primary text-primary dark:text-primary" 
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300 dark:hover:border-slate-600"
              )}
            >
              {tab.label}
            </a>
          </Link>
        ))}
      </nav>
    </div>
  );
}
