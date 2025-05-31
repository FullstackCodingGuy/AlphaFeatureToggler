
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { X, Filter, RotateCcw } from 'lucide-react';
import { useFeatureFlagStore, FilterState } from '@/stores/featureFlagStore';

interface FilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: Partial<FilterState>) => void;
}

const FilterDialog: React.FC<FilterDialogProps> = ({ isOpen, onClose, onApplyFilters }) => {
  const { filters, clearFilters } = useFeatureFlagStore();
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleReset = () => {
    clearFilters();
    setLocalFilters({
      search: '',
      status: '',
      type: '',
      environment: '',
      tags: [],
      rolloutRange: [0, 100],
      createdBy: '',
      lastModified: '',
      sortBy: 'name',
      sortOrder: 'asc'
    });
  };

  const addTag = () => {
    if (newTag && !localFilters.tags.includes(newTag)) {
      setLocalFilters(prev => ({
        ...prev,
        tags: [...prev.tags, newTag]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setLocalFilters(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
              <Filter className="h-5 w-5 text-white" />
            </div>
            <span>Advanced Filters</span>
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[70vh] space-y-6">
          {/* Status and Type Filters */}
          <Card className="border-0 bg-gradient-to-br from-slate-50 to-blue-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Basic Filters</CardTitle>
              <CardDescription>Filter by status, type, and environment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={localFilters.status} onValueChange={(value) => setLocalFilters(prev => ({...prev, status: value}))}>
                    <SelectTrigger>
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={localFilters.type} onValueChange={(value) => setLocalFilters(prev => ({...prev, type: value}))}>
                    <SelectTrigger>
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Types</SelectItem>
                      <SelectItem value="Boolean">Boolean</SelectItem>
                      <SelectItem value="String">String</SelectItem>
                      <SelectItem value="Multivariate">Multivariate</SelectItem>
                      <SelectItem value="JSON">JSON</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Environment</Label>
                <Select value={localFilters.environment} onValueChange={(value) => setLocalFilters(prev => ({...prev, environment: value}))}>
                  <SelectTrigger>
                    <SelectValue placeholder="All environments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Environments</SelectItem>
                    <SelectItem value="development">Development</SelectItem>
                    <SelectItem value="qa">QA</SelectItem>
                    <SelectItem value="staging">Staging</SelectItem>
                    <SelectItem value="production">Production</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Rollout Range */}
          <Card className="border-0 bg-gradient-to-br from-emerald-50 to-teal-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Rollout Range</CardTitle>
              <CardDescription>Filter by rollout percentage range</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium w-12">{localFilters.rolloutRange[0]}%</span>
                  <Slider
                    value={localFilters.rolloutRange}
                    onValueChange={(value) => setLocalFilters(prev => ({...prev, rolloutRange: value as [number, number]}))}
                    max={100}
                    step={5}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium w-12">{localFilters.rolloutRange[1]}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tags Filter */}
          <Card className="border-0 bg-gradient-to-br from-amber-50 to-orange-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Tags</CardTitle>
              <CardDescription>Filter by specific tags</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Add tag filter..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1"
                />
                <Button type="button" onClick={addTag} size="sm">
                  Add
                </Button>
              </div>
              
              {localFilters.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {localFilters.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                      <span>{tag}</span>
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Creator and Date Filters */}
          <Card className="border-0 bg-gradient-to-br from-violet-50 to-purple-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Creator & Date</CardTitle>
              <CardDescription>Filter by creator and modification date</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Created By</Label>
                <Input
                  placeholder="Search by creator email..."
                  value={localFilters.createdBy}
                  onChange={(e) => setLocalFilters(prev => ({...prev, createdBy: e.target.value}))}
                />
              </div>

              <div className="space-y-2">
                <Label>Last Modified</Label>
                <Select value={localFilters.lastModified} onValueChange={(value) => setLocalFilters(prev => ({...prev, lastModified: value}))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Sorting Options */}
          <Card className="border-0 bg-gradient-to-br from-rose-50 to-pink-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Sorting</CardTitle>
              <CardDescription>Configure how results are sorted</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Sort By</Label>
                  <Select value={localFilters.sortBy} onValueChange={(value) => setLocalFilters(prev => ({...prev, sortBy: value}))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="displayName">Display Name</SelectItem>
                      <SelectItem value="lastModified">Last Modified</SelectItem>
                      <SelectItem value="rollout">Rollout %</SelectItem>
                      <SelectItem value="createdBy">Created By</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Order</Label>
                  <Select value={localFilters.sortOrder} onValueChange={(value) => setLocalFilters(prev => ({...prev, sortOrder: value}))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asc">Ascending</SelectItem>
                      <SelectItem value="desc">Descending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator />

        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handleReset}
            className="flex items-center space-x-2"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset All</span>
          </Button>
          
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleApply}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FilterDialog;
