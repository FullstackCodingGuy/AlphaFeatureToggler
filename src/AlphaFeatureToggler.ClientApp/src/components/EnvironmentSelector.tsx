
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface EnvironmentSelectorProps {
  selected: string;
  onSelect: (environment: string) => void;
}

const EnvironmentSelector: React.FC<EnvironmentSelectorProps> = ({ selected, onSelect }) => {
  const environments = [
    { value: 'development', label: 'Development', color: 'bg-blue-100 text-blue-800' },
    { value: 'staging', label: 'Staging', color: 'bg-amber-100 text-amber-800' },
    { value: 'production', label: 'Production', color: 'bg-emerald-100 text-emerald-800' }
  ];

  const selectedEnv = environments.find(env => env.value === selected);

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium text-slate-600">Environment:</span>
      <Select value={selected} onValueChange={onSelect}>
        <SelectTrigger className="w-40 bg-white/70 border-slate-200">
          <SelectValue>
            {selectedEnv && (
              <Badge className={selectedEnv.color}>
                {selectedEnv.label}
              </Badge>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
          {environments.map((env) => (
            <SelectItem key={env.value} value={env.value}>
              <Badge className={env.color}>
                {env.label}
              </Badge>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default EnvironmentSelector;
