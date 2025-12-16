import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, Shield, Users, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import IndianCivicBackground from "@/components/IndianCivicBackground";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"user" | "admin">("user");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, role: userRole, loading } = useAuth();

  useEffect(() => {
    if (!loading && user && userRole) {
      navigate(userRole === "admin" ? "/admin" : "/report");
    }
  }, [user, userRole, loading, navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/`;
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            role: role,
          },
        },
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Account created successfully. You can now sign in.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id)
        .single();

      const userRole = roleData?.role || "user";

      toast({
        title: "Welcome back!",
        description: "Successfully signed in.",
      });

      navigate(userRole === "admin" ? "/admin" : "/report");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <IndianCivicBackground />
      
      {/* Base gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#004687]/10 via-white/50 to-[#FF9933]/10 z-[1]" />
      
      {/* Animated corner accents */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-[#FF9933]/20 to-transparent rounded-full blur-3xl animate-pulse z-[2]" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-[#046A38]/20 to-transparent rounded-full blur-3xl animate-pulse z-[2]" style={{ animationDelay: "1s" }} />
      <div className="absolute top-1/2 left-0 w-48 h-48 bg-gradient-to-r from-[#004687]/15 to-transparent rounded-full blur-2xl animate-pulse z-[2]" style={{ animationDelay: "0.5s" }} />
      
      {/* Content */}
      <div className="relative z-10 min-h-screen py-12 px-4 flex items-center justify-center">
        <div className="w-full max-w-md">
          <Button 
            variant="ghost" 
            asChild 
            className="mb-6 backdrop-blur-sm bg-white/30 hover:bg-white/50 border border-white/20 shadow-lg"
          >
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>

          {/* Main Card with glassmorphism */}
          <Card className="backdrop-blur-xl bg-white/70 border border-white/30 shadow-2xl shadow-[#004687]/10 overflow-hidden">
            {/* Decorative top border with tricolor */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#046A38]" />
            
            <CardHeader className="text-center pb-2 pt-8">
              {/* Government emblem placeholder */}
              <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-gradient-to-br from-[#004687] to-[#004687]/80 flex items-center justify-center shadow-lg">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-[#004687] via-[#004687] to-[#FF9933] bg-clip-text text-transparent">
                Civic Portal
              </CardTitle>
              <CardDescription className="text-base text-[#004687]/70 mt-2">
                Empowering Citizens • Strengthening Democracy
              </CardDescription>
              
              {/* Feature badges */}
              <div className="flex justify-center gap-3 mt-4">
                <div className="flex items-center gap-1 text-xs text-[#046A38] bg-[#046A38]/10 px-2 py-1 rounded-full">
                  <Shield className="w-3 h-3" />
                  <span>Secure</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-[#004687] bg-[#004687]/10 px-2 py-1 rounded-full">
                  <Users className="w-3 h-3" />
                  <span>Connected</span>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-4">
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-[#004687]/5 p-1 rounded-lg">
                  <TabsTrigger 
                    value="signin"
                    className="data-[state=active]:bg-white data-[state=active]:text-[#004687] data-[state=active]:shadow-md rounded-md transition-all"
                  >
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger 
                    value="signup"
                    className="data-[state=active]:bg-white data-[state=active]:text-[#004687] data-[state=active]:shadow-md rounded-md transition-all"
                  >
                    Sign Up
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="signin" className="mt-6">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email" className="text-[#004687] font-medium">Email</Label>
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-white/80 border-[#004687]/20 focus:border-[#004687] focus:ring-[#004687]/20 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signin-password" className="text-[#004687] font-medium">Password</Label>
                      <Input
                        id="signin-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="bg-white/80 border-[#004687]/20 focus:border-[#004687] focus:ring-[#004687]/20 transition-all"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-[#004687] to-[#004687]/90 hover:from-[#004687]/90 hover:to-[#004687] text-white shadow-lg shadow-[#004687]/20 transition-all hover:shadow-xl hover:shadow-[#004687]/30" 
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup" className="mt-6">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-[#004687] font-medium">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-white/80 border-[#004687]/20 focus:border-[#004687] focus:ring-[#004687]/20 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="text-[#004687] font-medium">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        className="bg-white/80 border-[#004687]/20 focus:border-[#004687] focus:ring-[#004687]/20 transition-all"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[#004687] font-medium">Account Type</Label>
                      <RadioGroup value={role} onValueChange={(value: "user" | "admin") => setRole(value)} className="space-y-2">
                        <div className="flex items-center space-x-3 p-3 rounded-lg bg-[#FF9933]/5 border border-[#FF9933]/20 hover:bg-[#FF9933]/10 transition-colors cursor-pointer">
                          <RadioGroupItem value="user" id="user" className="border-[#FF9933] text-[#FF9933]" />
                          <Label htmlFor="user" className="font-normal cursor-pointer flex-1">
                            <span className="font-medium text-[#004687]">Citizen</span>
                            <span className="block text-xs text-[#004687]/60">Report and track civic issues</span>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3 p-3 rounded-lg bg-[#046A38]/5 border border-[#046A38]/20 hover:bg-[#046A38]/10 transition-colors cursor-pointer">
                          <RadioGroupItem value="admin" id="admin" className="border-[#046A38] text-[#046A38]" />
                          <Label htmlFor="admin" className="font-normal cursor-pointer flex-1">
                            <span className="font-medium text-[#004687]">Municipal Staff</span>
                            <span className="block text-xs text-[#004687]/60">Manage and resolve reports</span>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-[#046A38] to-[#046A38]/90 hover:from-[#046A38]/90 hover:to-[#046A38] text-white shadow-lg shadow-[#046A38]/20 transition-all hover:shadow-xl hover:shadow-[#046A38]/30" 
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
              
              {/* Footer text */}
              <p className="text-center text-xs text-[#004687]/50 mt-6 pb-2">
                By continuing, you agree to serve your community
              </p>
            </CardContent>
          </Card>
          
          {/* Bottom decorative element */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 text-xs text-[#004687]/60 backdrop-blur-sm bg-white/30 px-4 py-2 rounded-full">
              <span className="w-2 h-2 rounded-full bg-[#FF9933]" />
              <span className="w-2 h-2 rounded-full bg-white border border-[#004687]/20" />
              <span className="w-2 h-2 rounded-full bg-[#046A38]" />
              <span className="ml-2">Digital India Initiative</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
