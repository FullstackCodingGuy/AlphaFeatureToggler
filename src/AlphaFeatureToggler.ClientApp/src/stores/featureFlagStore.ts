
import { create } from 'zustand';

export interface UserAttribute {
  key: string;
  value: string;
  type: 'string' | 'number' | 'boolean' | 'json';
}

export interface FeatureFlag {
  id: string;
  name: string;
  displayName: string;
  description: string;
  status: boolean;
  type: 'Boolean' | 'Multivariate' | 'String' | 'JSON';
  rollout: number;
  tags: string[];
  lastModified: string;
  createdBy: string;
  environments: string[];
  targeting: string;
  userAttributes?: UserAttribute[];
}

export interface FilterState {
  search: string;
  status: string;
  type: string;
  environment: string;
  tags: string[];
  rolloutRange: [number, number];
  createdBy: string;
  lastModified: string;
  sortBy: string;
  sortOrder: string;
}

export type ViewMode = 'list' | 'compact' | 'detailed';

interface FeatureFlagStore {
  flags: FeatureFlag[];
  selectedTenant: string;
  selectedApplication: string;
  selectedEnvironment: string;
  searchQuery: string;
  filters: FilterState;
  viewMode: ViewMode;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setFlags: (flags: FeatureFlag[]) => void;
  addFlag: (flag: FeatureFlag) => void;
  updateFlag: (id: string, updates: Partial<FeatureFlag>) => void;
  deleteFlag: (id: string) => void;
  setSelectedTenant: (tenant: string) => void;
  setSelectedApplication: (app: string) => void;
  setSelectedEnvironment: (env: string) => void;
  setSearchQuery: (query: string) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  setViewMode: (mode: ViewMode) => void;
  clearFilters: () => void;
  getFilteredFlags: () => FeatureFlag[];
}

const initialFilters: FilterState = {
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
};

// Mock data
const mockFlags: FeatureFlag[] = [
  {
    id: '1',
    name: 'new_checkout_ui',
    displayName: 'New Checkout UI',
    description: 'Modern checkout interface with improved UX and conversion optimization',
    status: true,
    type: 'Boolean',
    rollout: 75,
    tags: ['UI', 'Checkout', 'Revenue'],
    lastModified: '2 hours ago',
    createdBy: 'john.doe@company.com',
    environments: ['production', 'staging'],
    targeting: '75% of premium users',
    userAttributes: [
      { key: 'userTier', value: 'premium', type: 'string' },
      { key: 'minPurchaseAmount', value: '100', type: 'number' }
    ]
  },
  {
    id: '2',
    name: 'advanced_search',
    displayName: 'Advanced Search',
    description: 'Enhanced search with filters, AI suggestions, and real-time results',
    status: false,
    type: 'Multivariate',
    rollout: 0,
    tags: ['Search', 'AI', 'Beta'],
    lastModified: '1 day ago',
    createdBy: 'sarah.smith@company.com',
    environments: ['development', 'qa'],
    targeting: 'Internal beta testers',
    userAttributes: [
      { key: 'betaTester', value: 'true', type: 'boolean' },
      { key: 'searchConfig', value: '{"enableAI": true, "maxResults": 20}', type: 'json' }
    ]
  },
  {
    id: '3',
    name: 'mobile_app_redesign',
    displayName: 'Mobile App Redesign',
    description: 'Complete mobile interface overhaul with new navigation and dark mode',
    status: true,
    type: 'Boolean',
    rollout: 100,
    tags: ['Mobile', 'UI', 'Design'],
    lastModified: '3 days ago',
    createdBy: 'mike.johnson@company.com',
    environments: ['production', 'staging', 'qa'],
    targeting: 'All mobile users'
  },
  {
    id: '4',
    name: 'payment_gateway_v2',
    displayName: 'Payment Gateway v2',
    description: 'New payment processing system with reduced fees and better security',
    status: true,
    type: 'String',
    rollout: 25,
    tags: ['Payment', 'Security', 'Performance'],
    lastModified: '5 hours ago',
    createdBy: 'alice.williams@company.com',
    environments: ['staging'],
    targeting: 'Enterprise customers only',
    userAttributes: [
      { key: 'accountType', value: 'enterprise', type: 'string' },
      { key: 'paymentVolume', value: '10000', type: 'number' }
    ]
  }
];

export const useFeatureFlagStore = create<FeatureFlagStore>((set, get) => ({
  flags: mockFlags,
  selectedTenant: 'acme-corp',
  selectedApplication: 'web-app',
  selectedEnvironment: 'production',
  searchQuery: '',
  filters: initialFilters,
  viewMode: 'detailed',
  isLoading: false,
  error: null,

  setFlags: (flags) => set({ flags }),
  
  addFlag: (flag) => set((state) => ({ flags: [...state.flags, flag] })),
  
  updateFlag: (id, updates) => set((state) => ({
    flags: state.flags.map(flag => flag.id === id ? { ...flag, ...updates } : flag)
  })),
  
  deleteFlag: (id) => set((state) => ({
    flags: state.flags.filter(flag => flag.id !== id)
  })),
  
  setSelectedTenant: (tenant) => set({ selectedTenant: tenant }),
  setSelectedApplication: (app) => set({ selectedApplication: app }),
  setSelectedEnvironment: (env) => set({ selectedEnvironment: env }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setViewMode: (mode) => set({ viewMode: mode }),
  
  setFilters: (newFilters) => set((state) => ({
    filters: { ...state.filters, ...newFilters }
  })),
  
  clearFilters: () => set({ filters: initialFilters }),
  
  getFilteredFlags: () => {
    const { flags, searchQuery, filters } = get();
    
    return flags.filter(flag => {
      // Search filter
      if (searchQuery && !flag.displayName.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !flag.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !flag.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !flag.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))) {
        return false;
      }
      
      // Status filter
      if (filters.status && ((filters.status === 'active' && !flag.status) || 
          (filters.status === 'inactive' && flag.status))) {
        return false;
      }
      
      // Type filter
      if (filters.type && flag.type !== filters.type) {
        return false;
      }
      
      // Environment filter
      if (filters.environment && !flag.environments.includes(filters.environment)) {
        return false;
      }
      
      // Tags filter
      if (filters.tags.length > 0 && !filters.tags.some(tag => flag.tags.includes(tag))) {
        return false;
      }
      
      // Rollout range filter
      if (flag.rollout < filters.rolloutRange[0] || flag.rollout > filters.rolloutRange[1]) {
        return false;
      }
      
      // Created by filter
      if (filters.createdBy && !flag.createdBy.toLowerCase().includes(filters.createdBy.toLowerCase())) {
        return false;
      }
      
      return true;
    }).sort((a, b) => {
      const aVal = a[filters.sortBy as keyof FeatureFlag] as string;
      const bVal = b[filters.sortBy as keyof FeatureFlag] as string;
      
      if (filters.sortOrder === 'asc') {
        return aVal < bVal ? -1 : 1;
      } else {
        return aVal > bVal ? -1 : 1;
      }
    });
  }
}));
