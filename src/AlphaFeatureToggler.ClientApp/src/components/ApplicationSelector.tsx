
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
    <div className="flex items-center space-x-2">
      <Building className="h-4 w-4 text-slate-600" />
      <span className="text-sm font-medium text-slate-600">Application:</span>
      <Select value={selected} onValueChange={onSelect}>
        <SelectTrigger className="w-48 bg-white/70 border-slate-200">
          <SelectValue>
            {selectedApp && (
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4" />
                <span>{selectedApp.label}</span>
                <Badge variant="outline" className={selectedApp.color}>
                  {selectedApp.type}
                </Badge>
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
