import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from 'lucide-react';
import { UserAttribute } from '@/stores/featureFlagStore';

interface UserAttributesInputProps {
  attributes: UserAttribute[];
  onChange: (attributes: UserAttribute[]) => void;
  flagType: 'Boolean' | 'Multivariate' | 'String' | 'JSON';
}

const UserAttributesInput: React.FC<UserAttributesInputProps> = ({ attributes, onChange, flagType }) => {
  const [newAttribute, setNewAttribute] = useState<UserAttribute>({
    key: '',
    value: '',
    type: 'string'
  });

  const addAttribute = () => {
    if (newAttribute.key && newAttribute.value) {
      onChange([...attributes, { ...newAttribute }]);
      setNewAttribute({ key: '', value: '', type: 'string' });
    }
  };

  const removeAttribute = (index: number) => {
    onChange(attributes.filter((_, i) => i !== index));
  };

  const updateAttribute = (index: number, field: keyof UserAttribute, value: string) => {
    const updated = [...attributes];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const getPlaceholderValue = (type: string) => {
    switch (type) {
      case 'boolean': return 'true';
      case 'number': return '100';
      case 'json': return '{"key": "value"}';
      default: return 'Enter value';
    }
  };

  const getSuggestedAttributes = () => {
    const suggestions = {
      Boolean: ['userTier', 'betaTester', 'hasSubscription', 'isEmployee'],
      Multivariate: ['experimentGroup', 'userSegment', 'region', 'deviceType'],
      String: ['userId', 'companyId', 'locale', 'theme'],
      JSON: ['userPreferences', 'metadata', 'configuration', 'customData']
    };
    return suggestions[flagType] || [];
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-700">User Attributes</label>
        <div className="flex flex-wrap gap-1">
          {getSuggestedAttributes().map((suggestion) => (
            <Badge
              key={suggestion}
              variant="outline"
              className="text-xs cursor-pointer hover:bg-blue-50"
              onClick={() => setNewAttribute({ ...newAttribute, key: suggestion })}
            >
              {suggestion}
            </Badge>
          ))}
        </div>
      </div>

      {/* Existing Attributes */}
      <div className="space-y-2">
        {attributes.map((attr, index) => (
          <div key={index} className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
            <Input
              placeholder="Attribute key"
              value={attr.key}
              onChange={(e) => updateAttribute(index, 'key', e.target.value)}
              className="flex-1"
            />
            <Select value={attr.type} onValueChange={(value) => updateAttribute(index, 'type', value)}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="string">String</SelectItem>
                <SelectItem value="number">Number</SelectItem>
                <SelectItem value="boolean">Boolean</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder={getPlaceholderValue(attr.type)}
              value={attr.value}
              onChange={(e) => updateAttribute(index, 'value', e.target.value)}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => removeAttribute(index)}
              className="p-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Add New Attribute */}
      <div className="flex items-center gap-2 p-3 border-2 border-dashed border-slate-200 rounded-lg">
        <Input
          placeholder="Attribute key"
          value={newAttribute.key}
          onChange={(e) => setNewAttribute({ ...newAttribute, key: e.target.value })}
          className="flex-1"
        />
        <Select value={newAttribute.type} onValueChange={(value) => setNewAttribute({ ...newAttribute, type: value as any })}>
          <SelectTrigger className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="string">String</SelectItem>
            <SelectItem value="number">Number</SelectItem>
            <SelectItem value="boolean">Boolean</SelectItem>
            <SelectItem value="json">JSON</SelectItem>
          </SelectContent>
        </Select>
        <Input
          placeholder={getPlaceholderValue(newAttribute.type)}
          value={newAttribute.value}
          onChange={(e) => setNewAttribute({ ...newAttribute, value: e.target.value })}
          className="flex-1"
        />
        <Button
          type="button"
          onClick={addAttribute}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <p className="text-xs text-slate-500">
        Add custom attributes to define targeting criteria and feature behavior based on user properties.
      </p>
    </div>
  );
};

export default UserAttributesInput;
