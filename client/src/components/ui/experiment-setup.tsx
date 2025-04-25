import { Card, CardContent } from "@/components/ui/card";
import { FlaskRound } from "lucide-react";

interface ExperimentSetupProps {
  setup: string;
  className?: string;
}

export function ExperimentSetup({ setup, className = "" }: ExperimentSetupProps) {
  // Parse the experiment setup text to extract parameters
  const parseSetup = (setupText: string) => {
    // Use regex to extract key parameters
    const params: Record<string, string> = {};
    
    // Match patterns like "**Key**: Value" or "*Key*: Value"
    const paramPattern = /\*\*([^*]+)\*\*\s*:\s*([^*\n]+)|^\s*\*([^*]+)\*\s*:\s*([^*\n]+)/gm;
    
    let match;
    while ((match = paramPattern.exec(setupText)) !== null) {
      const key = match[1] || match[3];
      const value = match[2] || match[4];
      if (key && value) {
        params[key.trim()] = value.trim();
      }
    }
    
    return params;
  };
  
  const setupParams = parseSetup(setup);
  const hasParams = Object.keys(setupParams).length > 0;
  
  // Group parameters by category
  const groupParameters = (params: Record<string, string>) => {
    const groups: Record<string, Record<string, string>> = {
      'Dataset': {},
      'Model': {},
      'Training': {},
      'Augmentation': {},
      'Other': {}
    };
    
    for (const [key, value] of Object.entries(params)) {
      if (key.toLowerCase().includes('data') || key.toLowerCase().includes('dataset')) {
        groups['Dataset'][key] = value;
      } else if (key.toLowerCase().includes('model') || key.toLowerCase().includes('architecture')) {
        groups['Model'][key] = value;
      } else if (key.toLowerCase().includes('rate') || key.toLowerCase().includes('optimizer') 
                || key.toLowerCase().includes('batch') || key.toLowerCase().includes('epoch')
                || key.toLowerCase().includes('iteration')) {
        groups['Training'][key] = value;
      } else if (key.toLowerCase().includes('augment')) {
        groups['Augmentation'][key] = value;
      } else {
        groups['Other'][key] = value;
      }
    }
    
    // Remove empty groups
    for (const group in groups) {
      if (Object.keys(groups[group]).length === 0) {
        delete groups[group];
      }
    }
    
    return groups;
  };
  
  const parameterGroups = groupParameters(setupParams);
  
  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardContent className="p-0">
        <div className="bg-primary/10 text-primary p-4 flex items-center border-b border-border">
          <FlaskRound className="h-5 w-5 mr-2" />
          <h3 className="text-lg font-semibold">Experimental Setup</h3>
        </div>
        
        {hasParams ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {Object.entries(parameterGroups).map(([groupName, groupParams]) => (
              <div key={groupName}>
                <h4 className="font-semibold text-sm text-muted-foreground mb-2">{groupName}</h4>
                <div className="space-y-2">
                  {Object.entries(groupParams).map(([key, value]) => (
                    <div key={key} className="border border-border rounded-md p-2 bg-card">
                      <div className="text-xs text-muted-foreground">{key}</div>
                      <div className="font-mono text-sm">{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 whitespace-pre-wrap font-mono text-sm text-muted-foreground">
            {setup}
          </div>
        )}
      </CardContent>
    </Card>
  );
}