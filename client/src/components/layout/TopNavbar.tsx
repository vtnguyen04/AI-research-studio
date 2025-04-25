import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bell, Settings, Search, Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMobile } from "@/hooks/use-mobile";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function TopNavbar() {
  const { isMobile, toggleMobileMenu } = useMobile();
  const { theme, setTheme } = useTheme();
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  return (
    <div className="bg-white dark:bg-card border-b border-slate-200 dark:border-border sticky top-0 z-10">
      <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {isMobile && (
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleMobileMenu}
              className="text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-primary"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        )}
        
        <div className="flex-1 flex justify-center md:justify-end space-x-4">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input 
              type="text" 
              placeholder="Search concepts, papers, code..." 
              className="w-full pl-8"
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" className="text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-primary">
              <Bell className="h-5 w-5" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setSettingsOpen(true)}
              className="text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-primary"
            >
              <Settings className="h-5 w-5" />
            </Button>
            
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
      
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode">Dark Mode</Label>
              <Switch 
                id="dark-mode" 
                checked={theme === "dark"}
                onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
