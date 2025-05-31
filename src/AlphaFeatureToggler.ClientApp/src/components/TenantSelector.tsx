import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Building2, Crown } from 'lucide-react';

interface TenantSelectorProps {
  selected: string;
  onSelect: (tenant: string) => void;
}

const TenantSelector: React.FC<TenantSelectorProps> = ({ selected, onSelect }) => {
  const tenants = [
    { value: 'acme-corp', label: 'Acme Corporation', plan: 'Enterprise', color: 'bg-purple-100 text-purple-800' },
    { value: 'tech-startup', label: 'Tech Startup Inc', plan: 'Pro', color: 'bg-blue-100 text-blue-800' },
    { value: 'retail-chain', label: 'Retail Chain Ltd', plan: 'Business', color: 'bg-green-100 text-green-800' },
    { value: 'personal-project', label: 'Personal Project', plan: 'Free', color: 'bg-slate-100 text-slate-800' }
  ];

  const selectedTenant = tenants.find(tenant => tenant.value === selected);

  return (
    <div className="flex flex-col items-start w-full sm:w-auto">
      <label className="flex items-center gap-1 text-sm font-semibold text-slate-700 mb-1">
        <Building2 className="h-4 w-4 text-slate-600" />
        Organization
      </label>
      <Select value={selected} onValueChange={onSelect}>
        <SelectTrigger className="w-52 bg-white/70 border-slate-200">
          <SelectValue>
            {selectedTenant && (
              <div className="flex items-center space-x-2">
                <Crown className="h-4 w-4" />
                <span className="truncate">{selectedTenant.label}</span>
                {/* <Badge variant="outline" className={selectedTenant.color}>
                  {selectedTenant.plan}
                </Badge> */}
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
          {tenants.map((tenant) => (
            <SelectItem key={tenant.value} value={tenant.value}>
              <div className="flex items-center space-x-2">
                <Crown className="h-4 w-4" />
                <span>{tenant.label}</span>
                <Badge variant="outline" className={tenant.color}>
                  {tenant.plan}
                </Badge>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TenantSelector;
