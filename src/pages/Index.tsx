import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, TrendingUp, Landmark, Users, Target, Award, Sparkles, ArrowRight, Shield, AlertCircle } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import accentBg from "@/assets/accent-bg.jpg";
import { Navigation } from "@/components/Navigation";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      {/* Hero Section with Background */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center pt-20">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroBg} 
            alt="Indian Government Tricolor Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-background/5 via-background/10 to-background/20" />
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <div className="inline-flex items-center gap-2 bg-accent/90 backdrop-blur-sm border border-accent text-accent-foreground px-4 py-2 rounded-full text-sm font-medium mb-6 shadow-lg">
                <Landmark className="w-4 h-4" />
                Digital India Initiative
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight drop-shadow-lg">
                स्वच्छ भारत
                <span className="block bg-gradient-to-r from-warning to-accent bg-clip-text text-transparent mt-2">Clean India</span>
                <span className="block text-2xl md:text-3xl font-normal mt-4 text-foreground">
                  Empowering Citizens, Transforming Cities
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-foreground/90 mb-8 max-w-2xl leading-relaxed drop-shadow">
                Report civic issues instantly with AI-powered analysis. Join millions of citizens 
                building a smarter, cleaner India.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="text-lg px-8 py-6 bg-warning text-warning-foreground shadow-2xl hover:scale-105 transition-transform hover:shadow-warning/50">
                  <Link to="/report">
                    <FileText className="mr-2 w-5 h-5" />
                    Report Issue
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6 border-2 shadow-2xl hover:scale-105 transition-transform">
                  <Link to="/dashboard">
                    <TrendingUp className="mr-2 w-5 h-5" />
                    View Dashboard
                  </Link>
                </Button>
              </div>
            </div>
            
            {/* Stats Cards */}
            <div className="grid gap-4">
              <Card className="bg-card/95 backdrop-blur-md border-2 shadow-xl hover:shadow-2xl transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-warning" />
                    Active Citizens
                  </CardTitle>
                  <div className="text-4xl font-bold bg-gradient-to-r from-warning to-accent bg-clip-text text-transparent">10L+</div>
                  <CardDescription>
                    Across 500+ cities in India
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="bg-card/95 backdrop-blur-md border-2 shadow-xl hover:shadow-2xl transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-accent" />
                    Issues Resolved
                  </CardTitle>
                  <div className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">5L+</div>
                  <CardDescription>
                    Making India cleaner every day
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img src={accentBg} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-semibold mb-4">
              WHY CHOOSE CIVICAI
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Built for Modern India</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the future of civic engagement with cutting-edge technology
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="group border-2 hover:border-primary hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-card">
              <CardHeader className="pb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/60 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg">
                  <Sparkles className="w-8 h-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl mb-3">AI-Powered</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Advanced machine learning analyzes every report instantly, ensuring accurate categorization and smart routing.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group border-2 hover:border-accent hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-card">
              <CardHeader className="pb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-accent to-accent/60 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg">
                  <Award className="w-8 h-8 text-accent-foreground" />
                </div>
                <CardTitle className="text-2xl mb-3">Fast Resolution</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Issues get resolved 3x faster with automated department routing and priority-based workflows.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group border-2 hover:border-warning hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-card">
              <CardHeader className="pb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-warning to-warning/60 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg">
                  <Users className="w-8 h-8 text-warning-foreground" />
                </div>
                <CardTitle className="text-2xl mb-3">Community First</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Built by Indians, for Indians. Join millions making their communities cleaner and safer every day.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="text-center">
            <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6">
              <Link to="/how-it-works">
                Learn How It Works
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-primary via-primary to-accent relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-warning/30 via-transparent to-transparent" />
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]" />
        
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-primary-foreground mb-4">Impact By Numbers</h2>
            <p className="text-xl text-primary-foreground/90">Real results, real change across India</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background/10 backdrop-blur-md border border-background/20 rounded-2xl p-8 text-center hover:scale-105 transition-transform">
              <div className="text-6xl font-bold text-warning mb-2">98%</div>
              <div className="text-lg text-primary-foreground font-medium">AI Accuracy Rate</div>
              <div className="text-sm text-primary-foreground/80 mt-2">Precise issue detection</div>
            </div>
            <div className="bg-background/10 backdrop-blur-md border border-background/20 rounded-2xl p-8 text-center hover:scale-105 transition-transform">
              <div className="text-6xl font-bold text-background mb-2">3x</div>
              <div className="text-lg text-primary-foreground font-medium">Faster Resolution</div>
              <div className="text-sm text-primary-foreground/80 mt-2">Smart routing saves time</div>
            </div>
            <div className="bg-background/10 backdrop-blur-md border border-background/20 rounded-2xl p-8 text-center hover:scale-105 transition-transform">
              <div className="text-6xl font-bold text-accent mb-2">24/7</div>
              <div className="text-lg text-primary-foreground font-medium">Always Available</div>
              <div className="text-sm text-primary-foreground/80 mt-2">Report anytime, anywhere</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-card via-primary/5 to-accent/5 shadow-2xl overflow-hidden">
            <CardContent className="p-12 text-center">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <Shield className="w-4 h-4" />
                BE THE CHANGE
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Ready to Build a Better India?
              </h2>
              <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                Join millions of citizens making their voice heard. Every report counts, 
                every action matters in building the India of our dreams.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="text-lg px-10 py-7 shadow-xl hover:scale-105 transition-transform">
                  <Link to="/report">
                    <AlertCircle className="mr-2 w-5 h-5" />
                    Report Your First Issue
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-lg px-10 py-7 shadow-xl hover:scale-105 transition-transform">
                  <Link to="/dashboard">
                    <TrendingUp className="mr-2 w-5 h-5" />
                    Explore Dashboard
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;