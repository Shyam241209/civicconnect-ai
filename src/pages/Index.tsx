import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, TrendingUp, Landmark, Users, Target, ArrowRight } from "lucide-react";
import civicEngagementBg from "@/assets/civic-engagement-bg.jpg";
import { Navigation } from "@/components/Navigation";
import { useTranslation } from "@/hooks/use-translation";

const Index = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      {/* Hero Section with Background */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center pt-20">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={civicEngagementBg} 
            alt="Indian Government Civic Engagement Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-background/70 via-background/50 to-background/30" />
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
                {t("heroTitle")}
                <span className="block text-2xl md:text-3xl font-normal mt-4 text-foreground">
                  {t("heroSubtitle")}
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-foreground/90 mb-8 max-w-2xl leading-relaxed drop-shadow">
                {t("heroDescription")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="text-lg px-8 py-6 bg-warning text-warning-foreground shadow-2xl hover:scale-105 transition-transform hover:shadow-warning/50">
                  <Link to="/report">
                    <FileText className="mr-2 w-5 h-5" />
                    {t("reportIssue")}
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6 border-2 shadow-2xl hover:scale-105 transition-transform bg-background/80 backdrop-blur-sm">
                  <Link to="/dashboard">
                    <TrendingUp className="mr-2 w-5 h-5" />
                    {t("viewDashboard")}
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
                    {t("activeCitizens")}
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
                    {t("issuesResolved")}
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

      {/* Quick Links Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Get Started</h2>
            <p className="text-lg text-muted-foreground">Choose how you want to participate</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="group border-2 hover:border-primary hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <FileText className="w-7 h-7 text-primary" />
                  Report an Issue
                </CardTitle>
                <CardDescription className="text-base">
                  Upload a photo and let AI analyze civic issues in your area
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link to="/report">
                    Start Reporting <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="group border-2 hover:border-accent hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <TrendingUp className="w-7 h-7 text-accent" />
                  Learn How It Works
                </CardTitle>
                <CardDescription className="text-base">
                  Discover how our AI-powered platform transforms civic engagement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/how-it-works">
                    Explore Process <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;