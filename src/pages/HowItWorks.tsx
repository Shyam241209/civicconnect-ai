import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, TrendingUp, FileText, Camera, Brain, Zap, Shield, Users, ChevronRight } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import accentBg from "@/assets/accent-bg.jpg";

const HowItWorks = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0">
        <img src={accentBg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" />
      </div>
      <div className="relative z-10">
        <Navigation />
      
      <div className="pt-24 pb-20 px-4">
        {/* Hero Section */}
        <section className="max-w-6xl mx-auto text-center mb-20">
          <div className="inline-block bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-semibold mb-6">
            SIMPLE PROCESS
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            How CivicAI Works
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A revolutionary AI-powered platform that makes reporting and resolving civic issues 
            faster, smarter, and more efficient than ever before.
          </p>
        </section>

        {/* Main Steps */}
        <section className="max-w-7xl mx-auto mb-20">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Step 1 */}
            <Card className="relative overflow-hidden border-2 hover:border-primary hover:shadow-2xl transition-all duration-300 group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] group-hover:scale-150 transition-transform duration-500" />
              <CardHeader className="pb-8 relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/60 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg">
                  <AlertCircle className="w-10 h-10 text-primary-foreground" />
                </div>
                <div className="text-7xl font-bold text-primary/10 absolute top-4 right-4">01</div>
                <CardTitle className="text-3xl mb-3">Report Issue</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Spot a civic problem? Simply take a photo or describe it. Our system accepts both visual and text inputs for maximum flexibility.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Camera className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-1">Photo Upload</h4>
                      <p className="text-sm text-muted-foreground">Click or drag to upload issue photos</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-1">Detailed Description</h4>
                      <p className="text-sm text-muted-foreground">Add context and location details</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card className="relative overflow-hidden border-2 hover:border-accent hover:shadow-2xl transition-all duration-300 group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-bl-[100px] group-hover:scale-150 transition-transform duration-500" />
              <CardHeader className="pb-8 relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-accent to-accent/60 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg">
                  <Brain className="w-10 h-10 text-accent-foreground" />
                </div>
                <div className="text-7xl font-bold text-accent/10 absolute top-4 right-4">02</div>
                <CardTitle className="text-3xl mb-3">AI Analysis</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Advanced AI instantly processes your report, categorizing the issue and determining priority level automatically.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Brain className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-1">Smart Categorization</h4>
                      <p className="text-sm text-muted-foreground">AI identifies issue type instantly</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-1">Priority Assessment</h4>
                      <p className="text-sm text-muted-foreground">Automatic severity and urgency rating</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card className="relative overflow-hidden border-2 hover:border-warning hover:shadow-2xl transition-all duration-300 group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-warning/5 rounded-bl-[100px] group-hover:scale-150 transition-transform duration-500" />
              <CardHeader className="pb-8 relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-warning to-warning/60 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg">
                  <Zap className="w-10 h-10 text-warning-foreground" />
                </div>
                <div className="text-7xl font-bold text-warning/10 absolute top-4 right-4">03</div>
                <CardTitle className="text-3xl mb-3">Track & Resolve</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Monitor your report in real-time. Get updates as it moves through departments and watch your community improve.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-warning mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-1">Real-time Updates</h4>
                      <p className="text-sm text-muted-foreground">Stay informed of progress instantly</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-warning mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-1">Community Impact</h4>
                      <p className="text-sm text-muted-foreground">See how you're making a difference</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Technology Section */}
        <section className="max-w-6xl mx-auto mb-20">
          <Card className="border-2 bg-gradient-to-br from-card via-primary/5 to-accent/5">
            <CardHeader className="text-center pb-12">
              <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4 mx-auto">
                POWERED BY AI
              </div>
              <CardTitle className="text-4xl mb-4">The Technology Behind It</CardTitle>
              <CardDescription className="text-lg">
                Cutting-edge artificial intelligence that makes civic engagement smarter
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Brain className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-2">Computer Vision</h4>
                      <p className="text-muted-foreground">
                        Advanced image recognition analyzes photos to identify issues like potholes, 
                        garbage, broken infrastructure, and more with 98% accuracy.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-2">Smart Routing</h4>
                      <p className="text-muted-foreground">
                        AI automatically routes issues to the correct municipal department, 
                        reducing response time by up to 3x.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Zap className="w-6 h-6 text-warning" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-2">Priority Intelligence</h4>
                      <p className="text-muted-foreground">
                        Machine learning models assess severity and public safety impact to prioritize 
                        critical issues automatically.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Shield className="w-6 h-6 text-success" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-2">Data Security</h4>
                      <p className="text-muted-foreground">
                        End-to-end encryption and secure cloud storage ensure your data and 
                        reports are always protected.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA Section */}
        <section className="max-w-4xl mx-auto text-center">
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-card to-accent/5 overflow-hidden">
            <CardContent className="p-12">
              <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join millions of citizens making India cleaner and better. Your voice matters.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="text-lg px-8 py-6">
                  <Link to="/report">
                    <FileText className="mr-2 w-5 h-5" />
                    Report Your First Issue
                    <ChevronRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6">
                  <Link to="/dashboard">
                    View Dashboard
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
      </div>
    </div>
  );
};

export default HowItWorks;
