import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Building, Globe } from 'lucide-react';

interface ApplicationSelectorProps {
  selected: string;
  onSelect: (application: string) => void;
}

const ApplicationSelector: React.FC<ApplicationSelectorProps> = ({ selected, onSelect }) => {
  const applications = [
    { value: 'web-app', label: 'Web Application', type: 'Frontend', color: 'bg-blue-100 text-blue-800' },
    { value: 'mobile-app', label: 'Mobile App', type: 'Mobile', color: 'bg-green-100 text-green-800' },
    { value: 'api-service', label: 'API Service', type: 'Backend', color: 'bg-purple-100 text-purple-800' },
    { value: 'admin-panel', label: 'Admin Panel', type: 'Internal', color: 'bg-amber-100 text-amber-800' }
  ];

  const selectedApp = applications.find(app => app.value === selected);

  return (
    <div className="flex flex-col items-start w-full sm:w-auto">
      <label className="flex items-center gap-1 text-sm font-semibold text-slate-700 mb-1">
        <span className="inline-block">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
            <path d="M3 21V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v16" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <rect x="7" y="9" width="10" height="6" rx="1" stroke="#64748b" strokeWidth="1.5"/>
          </svg>
        </span>
        Application
      </label>
      <Select value={selected} onValueChange={onSelect}>
        <SelectTrigger className="w-52 bg-white/70 border-slate-200">
          <SelectValue>
            {selectedApp && (
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4" />
                <span>{selectedApp.label}</span>
                {/* <Badge variant="outline" className={selectedApp.color}>
                  {selectedApp.type}
                </Badge> */}
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
          {applications.map((app) => (
            <SelectItem key={app.value} value={app.value}>
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4" />
                <span>{app.label}</span>
                <Badge variant="outline" className={app.color}>
                  {app.type}
                </Badge>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ApplicationSelector;
