
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X, Target, Settings, Users, Zap, GitBranch } from 'lucide-react';
import UserAttributesInput from './UserAttributesInput';
import { UserAttribute } from '@/stores/featureFlagStore';

interface CreateFlagModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
  isEditing?: boolean;
}

const CreateFlagModal: React.FC<CreateFlagModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEditing = false
}) => {
  const [flagData, setFlagData] = useState({
    name: '',
    displayName: '',
    description: '',
    type: 'Boolean',
    defaultValue: '',
    tags: [],
    environments: [],
    killSwitchEnabled: false,
    temporaryFlag: false,
    targeting: ''
  });

  const [userAttributes, setUserAttributes] = useState<UserAttribute[]>([]);
  const [targetingRules, setTargetingRules] = useState({
    rolloutPercentage: 0,
    userSegments: [],
    conditions: []
  });

  const [currentTag, setCurrentTag] = useState('');
  const [selectedEnvironments, setSelectedEnvironments] = useState<string[]>([]);

  useEffect(() => {
    if (initialData && isEditing) {
      setFlagData({
        name: initialData.name || '',
        displayName: initialData.displayName || '',
        description: initialData.description || '',
        type: initialData.type || 'Boolean',
        defaultValue: initialData.defaultValue || '',
        tags: initialData.tags || [],
        environments: initialData.environments || [],
        killSwitchEnabled: initialData.killSwitchEnabled || false,
        temporaryFlag: initialData.temporaryFlag || false,
        targeting: initialData.targeting || ''
      });
      setUserAttributes(initialData.userAttributes || []);
      setTargetingRules({
        rolloutPercentage: initialData.rollout || 0,
        userSegments: [],
        conditions: []
      });
      setSelectedEnvironments(initialData.environments || []);
    }
  }, [initialData, isEditing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      name: flagData.name,
      displayName: flagData.displayName,
      description: flagData.description,
      type: flagData.type,
      status: true,
      rollout: targetingRules.rolloutPercentage,
      tags: flagData.tags,
      environments: selectedEnvironments,
      targeting: flagData.targeting || 'Manual targeting',
      userAttributes: userAttributes,
      defaultValue: flagData.defaultValue,
      killSwitchEnabled: flagData.killSwitchEnabled,
      temporaryFlag: flagData.temporaryFlag
    };

    console.log('Submitting flag:', submitData);
    if (onSubmit) {
      onSubmit(submitData);
    }
    onClose();
  };

  const addTag = () => {
    if (currentTag && !flagData.tags.includes(currentTag)) {
      setFlagData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFlagData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const toggleEnvironment = (env: string) => {
    setSelectedEnvironments(prev => 
      prev.includes(env) 
        ? prev.filter(e => e !== env)
        : [...prev, env]
    );
  };

  const getValueInputPlaceholder = (type: string) => {
    switch (type) {
      case 'Boolean': return 'true or false';
      case 'String': return 'Enter string value';
      case 'JSON': return '{"key": "value"}';
      case 'Multivariate': return 'variant1,variant2,variant3';
      default: return 'Enter value';
    }
  };

  const renderValueInput = () => {
    switch (flagData.type) {
      case 'Boolean':
        return (
          <Select value={flagData.defaultValue} onValueChange={(value) => setFlagData(prev => ({...prev, defaultValue: value}))}>
            <SelectTrigger>
              <SelectValue placeholder="Select boolean value" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">True</SelectItem>
              <SelectItem value="false">False</SelectItem>
            </SelectContent>
          </Select>
        );
      case 'JSON':
        return (
          <Textarea
            placeholder='{"key": "value", "enabled": true}'
            value={flagData.defaultValue}
            onChange={(e) => setFlagData(prev => ({...prev, defaultValue: e.target.value}))}
            className="font-mono text-sm"
            rows={4}
          />
        );
      case 'Multivariate':
        return (
          <Textarea
            placeholder="variant1,variant2,variant3"
            value={flagData.defaultValue}
            onChange={(e) => setFlagData(prev => ({...prev, defaultValue: e.target.value}))}
            rows={3}
          />
        );
      default:
        return (
          <Input
            placeholder={getValueInputPlaceholder(flagData.type)}
            value={flagData.defaultValue}
            onChange={(e) => setFlagData(prev => ({...prev, defaultValue: e.target.value}))}
          />
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span>{isEditing ? 'Edit Feature Flag' : 'Create New Feature Flag'}</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 overflow-hidden">
          <Tabs defaultValue="basic" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="basic" className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Basic</span>
              </TabsTrigger>
              <TabsTrigger value="targeting" className="flex items-center space-x-2">
                <Target className="h-4 w-4" />
                <span>Targeting</span>
              </TabsTrigger>
              <TabsTrigger value="attributes" className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Attributes</span>
              </TabsTrigger>
              <TabsTrigger value="environments" className="flex items-center space-x-2">
                <GitBranch className="h-4 w-4" />
                <span>Environments</span>
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto">
              <TabsContent value="basic" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Flag Configuration</CardTitle>
                    <CardDescription>Define the basic properties of your feature flag</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Flag Name *</Label>
                        <Input
                          id="name"
                          placeholder="e.g., new_checkout_ui"
                          value={flagData.name}
                          onChange={(e) => setFlagData(prev => ({...prev, name: e.target.value}))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="displayName">Display Name *</Label>
                        <Input
                          id="displayName"
                          placeholder="e.g., New Checkout UI"
                          value={flagData.displayName}
                          onChange={(e) => setFlagData(prev => ({...prev, displayName: e.target.value}))}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe what this feature flag controls..."
                        value={flagData.description}
                        onChange={(e) => setFlagData(prev => ({...prev, description: e.target.value}))}
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="type">Flag Type *</Label>
                        <Select value={flagData.type} onValueChange={(value) => setFlagData(prev => ({...prev, type: value, defaultValue: ''}))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Boolean">Boolean</SelectItem>
                            <SelectItem value="String">String</SelectItem>
                            <SelectItem value="Multivariate">Multivariate</SelectItem>
                            <SelectItem value="JSON">JSON</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="defaultValue">Default Value</Label>
                        {renderValueInput()}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Tags</Label>
                        <div className="flex space-x-2">
                          <Input
                            placeholder="Add tag..."
                            value={currentTag}
                            onChange={(e) => setCurrentTag(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                          />
                          <Button type="button" onClick={addTag} size="sm">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {flagData.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                              <span>{tag}</span>
                              <X 
                                className="h-3 w-3 cursor-pointer" 
                                onClick={() => removeTag(tag)}
                              />
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Kill Switch</Label>
                          <p className="text-sm text-muted-foreground">Enable emergency shutdown capability</p>
                        </div>
                        <Switch 
                          checked={flagData.killSwitchEnabled}
                          onCheckedChange={(checked) => setFlagData(prev => ({...prev, killSwitchEnabled: checked}))}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Temporary Flag</Label>
                          <p className="text-sm text-muted-foreground">Flag will be automatically archived after rollout</p>
                        </div>
                        <Switch 
                          checked={flagData.temporaryFlag}
                          onCheckedChange={(checked) => setFlagData(prev => ({...prev, temporaryFlag: checked}))}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="targeting" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Targeting Rules</CardTitle>
                    <CardDescription>Configure who will see this feature</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Rollout Percentage: {targetingRules.rolloutPercentage}%</Label>
                        <Slider
                          value={[targetingRules.rolloutPercentage]}
                          onValueChange={(value) => setTargetingRules(prev => ({...prev, rolloutPercentage: value[0]}))}
                          max={100}
                          step={1}
                          className="w-full"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="targeting">Targeting Description</Label>
                        <Textarea
                          id="targeting"
                          placeholder="Describe your targeting strategy..."
                          value={flagData.targeting}
                          onChange={(e) => setFlagData(prev => ({...prev, targeting: e.target.value}))}
                          rows={3}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="attributes" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>User Attributes</CardTitle>
                    <CardDescription>Define custom attributes for targeting and personalization</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <UserAttributesInput
                      attributes={userAttributes}
                      onChange={setUserAttributes}
                      flagType={flagData.type as 'Boolean' | 'Multivariate' | 'String' | 'JSON'}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="environments" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Environment Selection</CardTitle>
                    <CardDescription>Choose which environments this flag will be available in</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {['development', 'qa', 'staging', 'production'].map((env) => (
                        <div key={env} className="flex items-center space-x-2">
                          <Switch
                            checked={selectedEnvironments.includes(env)}
                            onCheckedChange={() => toggleEnvironment(env)}
                          />
                          <Label className="capitalize">{env}</Label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isEditing ? 'Update Flag' : 'Create Flag'}
              </Button>
            </div>
          </Tabs>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFlagModal;
