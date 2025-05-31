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
    { value: 'testing', label: 'Testing', color: 'bg-amber-100 text-amber-800' },
    { value: 'staging', label: 'Staging', color: 'bg-amber-100 text-amber-800' },
    { value: 'production', label: 'Production', color: 'bg-emerald-100 text-emerald-800' }
  ];

  const selectedEnv = environments.find(env => env.value === selected);

  return (
    <div className="flex flex-col items-start w-full sm:w-auto">
      <label className="flex items-center gap-1 text-sm font-semibold text-slate-700 mb-1">
        Environment
      </label>
      <Select value={selected} onValueChange={onSelect}>
        <SelectTrigger className="w-52 bg-white/70 border-slate-200">
          <SelectValue>
            {selectedEnv ? selectedEnv.label : 'Select Environment'}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
          {environments.map((env) => (
            <SelectItem key={env.value} value={env.value}>
              {env.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default EnvironmentSelector;
