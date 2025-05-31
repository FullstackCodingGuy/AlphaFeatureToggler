
import React from 'react';
import { Button } from "@/components/ui/button";
import { List, Grid3X3, Eye } from 'lucide-react';
import { ViewMode } from '@/stores/featureFlagStore';

interface ViewModeToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

const ViewModeToggle: React.FC<ViewModeToggleProps> = ({ viewMode, onViewModeChange }) => {
  const modes = [
    { mode: 'list' as ViewMode, icon: List, label: 'List' },
    { mode: 'compact' as ViewMode, icon: Grid3X3, label: 'Compact' },
    { mode: 'detailed' as ViewMode, icon: Eye, label: 'Detailed' }
  ];

  return (
    <div className="flex items-center bg-white/70 rounded-lg p-1 border border-slate-200">
      {modes.map(({ mode, icon: Icon, label }) => (
        <Button
          key={mode}
          variant={viewMode === mode ? "default" : "ghost"}
          size="sm"
          onClick={() => onViewModeChange(mode)}
          className={`px-3 py-2 ${viewMode === mode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'hover:bg-slate-100'}`}
        >
          <Icon className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">{label}</span>
        </Button>
      ))}
    </div>
  );
};

export default ViewModeToggle;
