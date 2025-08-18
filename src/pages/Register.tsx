
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";
import { useServiceCategories } from '@/hooks/useServiceCategories';

export default function Register() {
  const location = useLocation();
  const isProviderRoute = location.pathname === '/register/provider';
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState<'customer' | 'professional'>(
    isProviderRoute ? 'professional' : 'customer'
  );
  
  // Professional specific fields
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [experience, setExperience] = useState('');
  const [serviceCategories, setServiceCategories] = useState<string[]>([]);
  const [acceptTerms, setAcceptTerms] = useState(false);
  
  const { signUp, loading, error } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { categories } = useServiceCategories();

  // Set the initial tab based on the URL when component mounts
  useEffect(() => {
    if (isProviderRoute) {
      setUserType('professional');
    }
  }, [isProviderRoute]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please ensure your passwords match",
        variant: "destructive"
      });
      return;
    }

    if (userType === 'professional' && !acceptTerms) {
      toast({
        title: "Terms not accepted",
        description: "You must accept the terms of service to register as a professional",
        variant: "destructive"
      });
      return;
    }

    if (userType === 'professional' && serviceCategories.length === 0) {
      toast({
        title: "No service categories selected",
        description: "Please select at least one service category",
        variant: "destructive"
      });
      return;
    }

    try {
      // First sign up the user with Supabase Auth
      await signUp(email, password, { 
        name, 
        user_type: userType,
        ...(userType === 'professional' && { 
          phone,
          experience,
          service_categories: serviceCategories
        })
      });

      // Capture userType before async setTimeout
      const currentUserType = userType;

      // Wait for auth state to update
      setTimeout(async () => {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Then create a profile for them based on user type
        if (currentUserType === 'customer') {
          const { error: customerError } = await supabase
            .from('customers')
            .insert({
              user_id: user.id,
              name,
              email
            });
          if (customerError) throw customerError;
        } else {
          let experienceYears = 1;
          if (typeof experience === 'string') {
            const match = experience.match(/\d+/);
            if (match) experienceYears = parseInt(match[0], 10);
          }
          const categoriesArray = Array.isArray(serviceCategories) ? serviceCategories : [];

          const { error: professionalError } = await supabase
            .from('professionals')
            .insert({
              user_id: user.id,
              name,
              email,
              phone,
              bio: description,
              experience_years: experienceYears,
              service_categories: categoriesArray,
              is_verified: false,
              average_rating: 0,
              review_count: 0
            });
          if (professionalError) throw professionalError;
        }

        // Success message
        toast({
          title: "Account created successfully",
          description: `You've been registered as a ${currentUserType}. Please log in to continue.`,
        });

        // Debug log
        console.log('Redirecting after signup:', currentUserType);

        // Redirect: professionals to home, customers to login
        if (currentUserType === 'professional') {
          navigate('/');
        } else {
        navigate('/login');
        }
      }, 1000);
    } catch (error) {
      console.error('Registration error:', error);
      // --- FIX: Show error message in toast for easier debugging ---
      const message = error instanceof Error ? error.message : (error?.message || "An error occurred during registration");
      toast({
        title: "Registration failed",
        description: message,
        variant: "destructive"
      });
    }
  };

  // Get available service categories from our hook or use static data as fallback
  const availableCategories = categories.length > 0 
    ? categories.map(category => ({ 
        id: category.id, 
        name: category.name 
      }))
    : [
      { id: "plumbing", name: "Plumbing" },
      { id: "electrical", name: "Electrical" },
      { id: "cleaning", name: "Cleaning" },
      { id: "landscaping", name: "Landscaping" },
      { id: "home_repair", name: "Home Repair" },
      { id: "moving", name: "Moving Services" },
      { id: "painting", name: "Painting" },
      { id: "pest_control", name: "Pest Control" }
    ];

  return (
    <>
      <Navigation />
      <div className="container mx-auto py-12 flex justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Create an account</CardTitle>
            <CardDescription>
              Sign up to {userType === 'professional' ? 'offer your services' : 'find and book services'}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className="bg-destructive/20 text-destructive p-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <Tabs defaultValue={userType} onValueChange={(value) => setUserType(value as 'customer' | 'professional')}>
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="customer">Customer</TabsTrigger>
                  <TabsTrigger value="professional">Professional</TabsTrigger>
                </TabsList>

                <TabsContent value="customer">
                  <p className="text-sm text-muted-foreground mb-4">
                    Register as a customer to find and book services.
                  </p>
                </TabsContent>

                <TabsContent value="professional">
                  <p className="text-sm text-muted-foreground mb-4">
                    Register as a professional to offer your services.
                  </p>
                </TabsContent>
              </Tabs>

              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {userType === 'professional' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="+1 (555) 123-4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="experience">Years of Experience</Label>
                    <Select value={experience} onValueChange={setExperience}>
                      <SelectTrigger id="experience">
                        <SelectValue placeholder="Select experience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-2">1-2 years</SelectItem>
                        <SelectItem value="3-5">3-5 years</SelectItem>
                        <SelectItem value="5-10">5-10 years</SelectItem>
                        <SelectItem value="10+">10+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description of Services</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the services you offer..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Service Categories</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {availableCategories.map((category) => (
                        <div key={category.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`category-${category.id}`} 
                            checked={serviceCategories.includes(category.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setServiceCategories([...serviceCategories, category.id]);
                              } else {
                                setServiceCategories(
                                  serviceCategories.filter(id => id !== category.id)
                                );
                              }
                            }}
                          />
                          <Label 
                            htmlFor={`category-${category.id}`}
                            className="text-sm font-normal"
                          >
                            {category.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="terms" 
                      checked={acceptTerms}
                      onCheckedChange={(checked) => setAcceptTerms(!!checked)}
                      required
                    />
                    <Label htmlFor="terms" className="text-sm font-normal">
                      I agree to the Terms of Service and Privacy Policy
                    </Label>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>
              <div className="text-center text-sm">
                Already have an account?{' '}
                <Link to="/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
      <Footer />
    </>
  );
}
