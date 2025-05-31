import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Plus, Settings, Shield, Users, Zap, Activity, GitBranch, Code, Search, Filter } from 'lucide-react';
import FlagDashboard from '@/components/FlagDashboard';
import CreateFlagModal from '@/components/CreateFlagModal';
import FilterDialog from '@/components/FilterDialog';
import EnvironmentSelector from '@/components/EnvironmentSelector';
import ApplicationSelector from '@/components/ApplicationSelector';
import TenantSelector from '@/components/TenantSelector';
import ViewModeToggle from '@/components/ViewModeToggle';
import LoginForm from '@/components/LoginForm';
import SignupForm from '@/components/SignupForm';
import { useFeatureFlagStore } from '@/stores/featureFlagStore';
import { Avatar } from '@mui/material';
import Popover from '@mui/material/Popover';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';

const Index = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [editingFlag, setEditingFlag] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const {
    selectedTenant,
    selectedApplication, 
    selectedEnvironment,
    searchQuery,
    viewMode,
    filters,
    setSelectedTenant,
    setSelectedApplication,
    setSelectedEnvironment,
    setSearchQuery,
    setViewMode,
    setFilters,
    clearFilters,
    addFlag,
    updateFlag
  } = useFeatureFlagStore();

  const handleEditFlag = (flag: unknown) => {
    setEditingFlag(flag);
    setIsEditModalOpen(true);
  };

  const handleApplyFilters = (newFilters: unknown) => {
    setFilters(newFilters);
    console.log('Applied filters:', newFilters);
  };

  const handleLogin = (credentials: unknown) => {
    console.log('Login:', credentials);
    setIsAuthenticated(true);
  };

  const handleSignup = (userData: unknown) => {
    console.log('Signup:', userData);
    setIsAuthenticated(true);
  };

  const handleCreateFlag = (flagData: unknown) => {
    const newFlag = {
      ...(flagData as object),
      id: Date.now().toString(),
      lastModified: 'Just now',
      createdBy: 'current.user@company.com'
    };
    addFlag(newFlag);
  };

  const handleUpdateFlag = (flagData: unknown) => {
    if (editingFlag) {
      updateFlag((editingFlag as { id: string }).id, {
        ...(flagData as object),
        lastModified: 'Just now'
      });
    }
  };

  // Demo user (replace with real user context in production)
  const user = { name: 'John Doe', email: 'john.doe@company.com', avatarUrl: '' };
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);

  if (!isAuthenticated) {
    return authMode === 'login' ? (
      <LoginForm 
        onLogin={handleLogin}
        onSwitchToSignup={() => setAuthMode('signup')}
      />
    ) : (
      <SignupForm 
        onSignup={handleSignup}
        onSwitchToLogin={() => setAuthMode('login')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Refined Header */}
      <header className="bg-white/90 backdrop-blur border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col gap-2">
          {/* Top Row: Brand & Logout */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg">
                  <Zap className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
                    AlphaFeatureToggler
                  </h1>
                  <p className="text-xs text-slate-500 font-medium">A feature manager for every app.</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 ml-2 px-3 py-1 rounded-full text-xs font-semibold hidden md:inline-flex">
                Multi-Tenant SaaS
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              {/* User Profile Avatar Section */}
              <div className="flex items-center gap-2 cursor-pointer" onClick={handleProfileClick}>
                <Avatar alt={user.name} src={user.avatarUrl} sx={{ width: 32, height: 32, bgcolor: '#6366f1', fontSize: 16 }}>
                  {user.name[0]}
                </Avatar>
                <span className="hidden sm:inline text-sm font-medium text-slate-700">{user.name}</span>
              </div>
              <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handlePopoverClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{ sx: { minWidth: 180, p: 1 } }}
              >
                <List>
                  <ListItem component="button" onClick={handlePopoverClose}>
                    <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
                    <ListItemText primary="Profile" />
                  </ListItem>
                  <ListItem component="button" onClick={handlePopoverClose}>
                    <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
                    <ListItemText primary="Settings" />
                  </ListItem>
                  <ListItem component="button" onClick={() => { handlePopoverClose(); setIsAuthenticated(false); }}>
                    <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
                    <ListItemText primary="Logout" />
                  </ListItem>
                </List>
              </Popover>
            </div>
          </div>

          {/* Bottom Row: Controls */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-2">
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 flex-1">
              <TenantSelector 
                selected={selectedTenant}
                onSelect={setSelectedTenant}
              />
              <ApplicationSelector 
                selected={selectedApplication}
                onSelect={setSelectedApplication}
              />
              <EnvironmentSelector 
                selected={selectedEnvironment}
                onSelect={setSelectedEnvironment}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 items-stretch md:items-center mt-2 md:mt-0">
              <Button 
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Flag
              </Button>
              <div className="relative flex-1 min-w-[180px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Search feature flags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/70 border-slate-200 focus:border-blue-400"
                />
              </div>
              <Button
                variant="outline"
                size="default"
                onClick={() => setIsFilterDialogOpen(true)}
                className="bg-white/80 hover:bg-white/90 border-slate-300 flex-shrink-0"
              >
                <Filter className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Filters</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs lg:text-sm font-medium text-slate-600 truncate">Active Flags</p>
                  <p className="text-xl lg:text-3xl font-bold text-slate-900">18</p>
                  <p className="text-xs text-emerald-600 mt-1">+3 this week</p>
                </div>
                <div className="p-2 lg:p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex-shrink-0">
                  <Settings className="h-4 w-4 lg:h-6 lg:w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs lg:text-sm font-medium text-slate-600 truncate">Environments</p>
                  <p className="text-xl lg:text-3xl font-bold text-emerald-600">4</p>
                  <p className="text-xs text-slate-500 mt-1 truncate">Dev, QA, Stage, Prod</p>
                </div>
                <div className="p-2 lg:p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex-shrink-0">
                  <GitBranch className="h-4 w-4 lg:h-6 lg:w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs lg:text-sm font-medium text-slate-600 truncate">Applications</p>
                  <p className="text-xl lg:text-3xl font-bold text-purple-600">4</p>
                  <p className="text-xs text-slate-500 mt-1 truncate">Cross-platform</p>
                </div>
                <div className="p-2 lg:p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex-shrink-0">
                  <Code className="h-4 w-4 lg:h-6 lg:w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs lg:text-sm font-medium text-slate-600 truncate">Team Members</p>
                  <p className="text-xl lg:text-3xl font-bold text-amber-600">12</p>
                  <p className="text-xs text-slate-500 mt-1 truncate">Across 3 teams</p>
                </div>
                <div className="p-2 lg:p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex-shrink-0">
                  <Users className="h-4 w-4 lg:h-6 lg:w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Tabs */}
        <Tabs defaultValue="flags" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start mb-4">
            <div>
              <TabsList className="bg-white/80 backdrop-blur-sm border-0 shadow-lg p-1 rounded-xl w-full sm:w-auto">
                <TabsTrigger 
                  value="flags" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 rounded-lg flex-1 sm:flex-initial"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Feature Flags</span>
                  <span className="sm:hidden">Flags</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="security" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 rounded-lg flex-1 sm:flex-initial"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Security & Approvals</span>
                  <span className="sm:hidden">Security</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="audit" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 rounded-lg flex-1 sm:flex-initial"
                >
                  <Activity className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Audit Log</span>
                  <span className="sm:hidden">Audit</span>
                </TabsTrigger>
              </TabsList>
            </div>
            <div className="flex justify-end w-full">
              <ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />
            </div>
          </div>
          <TabsContent value="flags">
            <FlagDashboard 
              onEditFlag={handleEditFlag}
            />
          </TabsContent>

          <TabsContent value="security">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <span>Security & Change Approvals</span>
                </CardTitle>
                <CardDescription>
                  Manage permissions, approval workflows, and security policies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-slate-900">Pending Approvals</h3>
                    {[1, 2].map((item) => (
                      <div key={item} className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-200">
                        <div>
                          <p className="font-medium">Flag "payment_gateway_v2" activation</p>
                          <p className="text-sm text-slate-600">Requested by john.doe@company.com</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">Reject</Button>
                          <Button size="sm">Approve</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold text-slate-900">Security Policies</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <span className="text-sm">Production changes require approval</span>
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <span className="text-sm">Multi-factor authentication required</span>
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <span className="text-sm">Audit logging enabled</span>
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-blue-600" />
                  <span>Audit Log</span>
                </CardTitle>
                <CardDescription>
                  Track all changes and activities across your feature flags
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { action: 'Flag "new_checkout_ui" was activated', user: 'john.doe@company.com', time: '2 hours ago', type: 'Activation' },
                    { action: 'Flag "dark_mode" rollout increased to 50%', user: 'sarah.smith@company.com', time: '4 hours ago', type: 'Rollout' },
                    { action: 'Flag "beta_features" was created', user: 'mike.johnson@company.com', time: '1 day ago', type: 'Creation' },
                    { action: 'Security policy updated', user: 'admin@company.com', time: '2 days ago', type: 'Security' },
                    { action: 'Flag "old_payment_ui" was archived', user: 'jane.doe@company.com', time: '3 days ago', type: 'Archive' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div>
                          <p className="font-medium">{item.action}</p>
                          <p className="text-sm text-slate-600">by {item.user} • {item.time}</p>
                        </div>
                      </div>
                      <Badge variant="outline">{item.type}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Modals */}
      <CreateFlagModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateFlag}
      />

      <CreateFlagModal 
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingFlag(null);
        }}
        initialData={editingFlag}
        isEditing={true}
        onSubmit={handleUpdateFlag}
      />

      <FilterDialog
        isOpen={isFilterDialogOpen}
        onClose={() => setIsFilterDialogOpen(false)}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
};

export default Index;
