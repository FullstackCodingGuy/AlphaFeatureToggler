
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2, Copy, TrendingUp, Eye, EyeOff } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useFeatureFlagStore, FeatureFlag } from '@/stores/featureFlagStore';

interface FlagDashboardProps {
  onEditFlag?: (flag: FeatureFlag) => void;
}

const FlagDashboard: React.FC<FlagDashboardProps> = ({ onEditFlag }) => {
  const { viewMode, getFilteredFlags, updateFlag } = useFeatureFlagStore();
  const filteredFlags = getFilteredFlags();

  const getStatusColor = (status: boolean) => {
    return status ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-slate-100 text-slate-800 border-slate-200';
  };

  const getTypeColor = (type: string) => {
    const colors = {
      'Boolean': 'bg-blue-100 text-blue-800 border-blue-200',
      'Multivariate': 'bg-purple-100 text-purple-800 border-purple-200',
      'String': 'bg-orange-100 text-orange-800 border-orange-200',
      'JSON': 'bg-pink-100 text-pink-800 border-pink-200'
    };
    return colors[type as keyof typeof colors] || 'bg-slate-100 text-slate-800 border-slate-200';
  };

  const getRolloutColor = (rollout: number) => {
    if (rollout === 0) return 'from-slate-400 to-slate-500';
    if (rollout < 25) return 'from-red-400 to-red-500';
    if (rollout < 50) return 'from-orange-400 to-orange-500';
    if (rollout < 75) return 'from-yellow-400 to-yellow-500';
    if (rollout < 100) return 'from-blue-400 to-blue-500';
    return 'from-emerald-400 to-emerald-500';
  };

  const handleToggleFlag = (flagId: string, currentStatus: boolean) => {
    updateFlag(flagId, { status: !currentStatus });
  };

  if (filteredFlags.length === 0) {
    return (
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
        <CardContent className="p-12 text-center">
          <div className="text-slate-400 mb-4">
            <EyeOff className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-slate-600 mb-2">No flags found</h3>
          <p className="text-slate-500">Try adjusting your search criteria or create a new feature flag.</p>
        </CardContent>
      </Card>
    );
  }

  if (viewMode === 'list') {
    return (
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {filteredFlags.map((flag) => (
              <div key={flag.id} className="p-4 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <Switch 
                      checked={flag.status} 
                      onCheckedChange={() => handleToggleFlag(flag.id, flag.status)}
                      className="data-[state=checked]:bg-emerald-500" 
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-slate-900 truncate">{flag.displayName}</h3>
                        <Badge variant="outline" className={`${getStatusColor(flag.status)} border text-xs`}>
                          {flag.status ? 'Active' : 'Inactive'}
                        </Badge>
                        <Badge variant="outline" className={`${getTypeColor(flag.type)} border text-xs`}>
                          {flag.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 truncate">{flag.description}</p>
                    </div>
                    <div className="hidden md:flex items-center gap-4 text-sm text-slate-500">
                      <span className="font-medium">{flag.rollout}%</span>
                      <span>{flag.lastModified}</span>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
                      <DropdownMenuItem onClick={() => onEditFlag && onEditFlag(flag)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Flag
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (viewMode === 'compact') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredFlags.map((flag) => (
          <Card key={flag.id} className="bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900 truncate text-lg">{flag.displayName}</h3>
                  <p className="text-sm text-slate-600 line-clamp-2">{flag.description}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEditFlag && onEditFlag(flag)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div className="flex gap-2">
                  <Badge variant="outline" className={`${getStatusColor(flag.status)} border`}>
                    {flag.status ? 'Active' : 'Inactive'}
                  </Badge>
                  <Badge variant="outline" className={`${getTypeColor(flag.type)} border`}>
                    {flag.type}
                  </Badge>
                </div>
                <Switch 
                  checked={flag.status} 
                  onCheckedChange={() => handleToggleFlag(flag.id, flag.status)}
                  className="data-[state=checked]:bg-emerald-500" 
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Rollout</span>
                <span className="font-bold text-slate-900">{flag.rollout}%</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full mt-1">
                <div 
                  className={`h-full bg-gradient-to-r ${getRolloutColor(flag.rollout)} rounded-full transition-all duration-500`}
                  style={{ width: `${flag.rollout}%` }}
                />
              </div>

              <div className="flex flex-wrap gap-1 mt-3">
                {flag.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Detailed view (default)
  return (
    <div className="space-y-4">
      {filteredFlags.map((flag) => (
        <Card key={flag.id} className="bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group overflow-hidden">
          <CardContent className="p-0">
            {/* Flag Header */}
            <div className="p-6 pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl font-bold text-slate-900 truncate">{flag.displayName}</h3>
                    <Badge variant="outline" className={`${getStatusColor(flag.status)} border font-medium`}>
                      {flag.status ? 'Active' : 'Inactive'}
                    </Badge>
                    <Badge variant="outline" className={`${getTypeColor(flag.type)} border font-medium`}>
                      {flag.type}
                    </Badge>
                  </div>
                  <p className="text-slate-600 text-base leading-relaxed mb-4">{flag.description}</p>
                  
                  {/* Meta Information */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      Key: <code className="bg-slate-100 px-2 py-1 rounded text-xs font-mono">{flag.name}</code>
                    </span>
                    <span>Modified {flag.lastModified}</span>
                    <span>by {flag.createdBy}</span>
                    <span>Targeting: {flag.targeting}</span>
                  </div>

                  {/* User Attributes */}
                  {flag.userAttributes && flag.userAttributes.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold text-slate-700 mb-2">User Attributes:</h4>
                      <div className="flex flex-wrap gap-2">
                        {flag.userAttributes.map((attr, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {attr.key}: {attr.value} ({attr.type})
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
                    <DropdownMenuItem onClick={() => onEditFlag && onEditFlag(flag)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Flag
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <TrendingUp className="h-4 w-4 mr-2" />
                      View Analytics
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Flag Controls and Stats */}
            <div className="px-6 pb-6">
              <div className="flex items-center justify-between">
                {/* Rollout Progress */}
                <div className="flex-1 max-w-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">Rollout Progress</span>
                    <span className="text-2xl font-bold text-slate-900">{flag.rollout}%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${getRolloutColor(flag.rollout)} transition-all duration-500 rounded-full relative overflow-hidden`}
                      style={{ width: `${flag.rollout}%` }}
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                    </div>
                  </div>
                </div>

                {/* Toggle Switch */}
                <div className="flex items-center gap-4">
                  <Switch 
                    checked={flag.status} 
                    onCheckedChange={() => handleToggleFlag(flag.id, flag.status)}
                    className="data-[state=checked]:bg-emerald-500 scale-125" 
                  />
                </div>
              </div>
            </div>

            {/* Tags Section */}
            <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {flag.tags.map((tag) => (
                    <Badge 
                      key={tag} 
                      variant="secondary" 
                      className="text-xs bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 hover:from-slate-200 hover:to-slate-300 transition-colors cursor-pointer"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>Environments:</span>
                  {flag.environments.map((env, index) => (
                    <Badge key={env} variant="outline" className="text-xs">
                      {env}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FlagDashboard;
