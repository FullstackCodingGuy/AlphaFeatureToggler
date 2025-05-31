
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Zap, Mail, Lock, Eye, EyeOff, User, Building } from 'lucide-react';

interface SignupFormProps {
  onSignup: (userData: any) => void;
  onSwitchToLogin: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSignup, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    organizationName: '',
    organizationType: '',
    acceptTerms: false,
    acceptMarketing: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    onSignup(formData);
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const socialProviders = [
    { name: 'Google', icon: '🔍', color: 'hover:bg-red-50 border-red-200 text-red-700' },
    { name: 'GitHub', icon: '🐙', color: 'hover:bg-gray-50 border-gray-200 text-gray-700' },
    { name: 'Microsoft', icon: '🏢', color: 'hover:bg-blue-50 border-blue-200 text-blue-700' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl">
              <Zap className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Create Account
          </CardTitle>
          <p className="text-slate-600 mt-2">Start managing feature flags today</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Social Signup */}
          <div className="space-y-3">
            {socialProviders.map((provider) => (
              <Button
                key={provider.name}
                variant="outline"
                className={`w-full ${provider.color} border-2 transition-all duration-200 hover:scale-[1.02]`}
                onClick={() => console.log(`Signup with ${provider.name}`)}
              >
                <span className="mr-3 text-lg">{provider.icon}</span>
                Continue with {provider.name}
              </Button>
            ))}
          </div>

          <div className="relative">
            <Separator className="bg-slate-200" />
            <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-sm text-slate-500">
              or create account with email
            </span>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">First Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={(e) => updateFormData('firstName', e.target.value)}
                    className="pl-10 bg-white/70 border-slate-200 focus:border-blue-400"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Last Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={(e) => updateFormData('lastName', e.target.value)}
                    className="pl-10 bg-white/70 border-slate-200 focus:border-blue-400"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  className="pl-10 bg-white/70 border-slate-200 focus:border-blue-400"
                  required
                />
              </div>
            </div>

            {/* Organization Details */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Organization Name</label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    placeholder="Your organization name"
                    value={formData.organizationName}
                    onChange={(e) => updateFormData('organizationName', e.target.value)}
                    className="pl-10 bg-white/70 border-slate-200 focus:border-blue-400"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Organization Type</label>
                <Select value={formData.organizationType} onValueChange={(value) => updateFormData('organizationType', value)}>
                  <SelectTrigger className="bg-white/70 border-slate-200 focus:border-blue-400">
                    <SelectValue placeholder="Select organization type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="startup">Startup</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                    <SelectItem value="agency">Agency</SelectItem>
                    <SelectItem value="nonprofit">Non-profit</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="government">Government</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Password Fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create password"
                    value={formData.password}
                    onChange={(e) => updateFormData('password', e.target.value)}
                    className="pl-10 pr-10 bg-white/70 border-slate-200 focus:border-blue-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                    className="pl-10 pr-10 bg-white/70 border-slate-200 focus:border-blue-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="terms" 
                  checked={formData.acceptTerms}
                  onCheckedChange={(checked) => updateFormData('acceptTerms', checked)}
                  className="mt-1"
                />
                <label htmlFor="terms" className="text-sm text-slate-600 leading-5">
                  I agree to the <span className="text-blue-600 hover:underline cursor-pointer">Terms of Service</span> and <span className="text-blue-600 hover:underline cursor-pointer">Privacy Policy</span>
                </label>
              </div>
              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="marketing" 
                  checked={formData.acceptMarketing}
                  onCheckedChange={(checked) => updateFormData('acceptMarketing', checked)}
                  className="mt-1"
                />
                <label htmlFor="marketing" className="text-sm text-slate-600 leading-5">
                  I'd like to receive product updates and marketing communications
                </label>
              </div>
            </div>

            <Button
              type="submit"
              disabled={!formData.acceptTerms}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Account
            </Button>
          </form>

          <div className="text-center">
            <span className="text-slate-600">Already have an account? </span>
            <Button
              variant="link"
              onClick={onSwitchToLogin}
              className="text-blue-600 hover:text-blue-700 p-0 font-semibold"
            >
              Sign in
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupForm;
