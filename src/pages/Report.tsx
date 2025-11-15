import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Upload, MapPin, Camera, FileText, Zap } from "lucide-react";
import { AnalysisResults } from "@/components/AnalysisResults";
import { Navigation } from "@/components/Navigation";
import subpageBg from "@/assets/subpage-bg.jpg";

interface AnalysisResult {
  issue_category: string;
  severity: string;
  priority_level: string;
  short_description: string;
  suggested_department: string;
  context_analysis: string;
  estimated_resolution_time: string;
  recommended_action: string;
  ai_confidence_score: number;
}

const Report = () => {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image && !description) {
      toast({
        title: "Missing Information",
        description: "Please provide either an image or description",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      let imageUrl = "";

      // Upload image if provided
      if (image) {
        const fileExt = image.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("civic-reports")
          .upload(fileName, image);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("civic-reports")
          .getPublicUrl(fileName);

        imageUrl = publicUrl;
      }

      // Call AI analysis edge function
      const { data, error } = await supabase.functions.invoke("analyze-civic-issue", {
        body: {
          imageUrl,
          description,
          locationData: location ? { address: location } : null,
        },
      });

      if (error) {
        if (error.message.includes("429")) {
          toast({
            title: "Rate Limit Exceeded",
            description: "Too many requests. Please try again later.",
            variant: "destructive",
          });
          return;
        }
        if (error.message.includes("402")) {
          toast({
            title: "Credits Exhausted",
            description: "AI analysis credits exhausted. Please add credits.",
            variant: "destructive",
          });
          return;
        }
        throw error;
      }

      setAnalysisResult(data);
      toast({
        title: "Analysis Complete",
        description: "AI has successfully analyzed your report",
      });
    } catch (error) {
      console.error("Error analyzing issue:", error);
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze the issue. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveReport = async () => {
    if (!analysisResult) return;

    setIsSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to save your report",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      let imageUrl = "";
      if (image) {
        const fileExt = image.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("civic-reports")
          .upload(fileName, image);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("civic-reports")
          .getPublicUrl(fileName);

        imageUrl = publicUrl;
      }

      const { error: insertError } = await supabase.from("civic_reports").insert({
        user_id: user.id,
        image_url: imageUrl,
        user_description: description,
        location_data: location ? { address: location } : null,
        ...analysisResult,
      });

      if (insertError) throw insertError;

      toast({
        title: "Report Saved",
        description: "Your report has been submitted successfully",
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving report:", error);
      toast({
        title: "Save Failed",
        description: "Failed to save the report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0">
        <img src={subpageBg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      </div>
      <div className="relative z-10">
        <Navigation />
      
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
              REPORT AN ISSUE
            </div>
            <h1 className="text-5xl font-bold text-foreground mb-4">
              Make Your Voice Heard
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Report civic issues instantly. Our AI will analyze and route your report automatically.
            </p>
          </div>

          {/* Progress Indicators */}
          {!analysisResult && (
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <Card className="border-2 border-primary bg-primary/5">
                <CardContent className="pt-6 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <Camera className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold">1. Capture</h3>
                      <p className="text-sm text-muted-foreground">Upload photo & details</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-2">
                <CardContent className="pt-6 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                      <Zap className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-muted-foreground">2. Analyze</h3>
                      <p className="text-sm text-muted-foreground">AI processes report</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-2">
                <CardContent className="pt-6 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                      <FileText className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-muted-foreground">3. Submit</h3>
                      <p className="text-sm text-muted-foreground">Save & track progress</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <Card className="mb-6 border-2 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
              <CardTitle className="text-3xl flex items-center gap-3">
                <Camera className="w-8 h-8 text-primary" />
                Issue Details
              </CardTitle>
              <CardDescription className="text-base">
                Provide as much information as possible for accurate AI analysis
              </CardDescription>
            </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div>
              <Label htmlFor="image" className="text-base font-semibold flex items-center gap-2">
                <Camera className="w-4 h-4" />
                Issue Photo (Optional)
              </Label>
              <p className="text-sm text-muted-foreground mt-1 mb-2">
                A clear photo helps AI analyze the issue more accurately
              </p>
              <div className="mt-2 relative">
                <div className="border-2 border-dashed border-border rounded-lg p-8 hover:border-primary transition-colors bg-muted/20">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={isAnalyzing}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="text-center">
                    <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm font-medium">
                      {image ? image.name : "Click to upload or drag and drop"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG, JPEG up to 10MB
                    </p>
                  </div>
                </div>
              </div>
              {imagePreview && (
                <div className="mt-4">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="rounded-lg max-h-64 w-full object-cover"
                  />
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="description" className="text-base font-semibold flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Issue Description
              </Label>
              <p className="text-sm text-muted-foreground mt-1 mb-2">
                Describe what you're seeing and why it's a problem
              </p>
              <Textarea
                id="description"
                placeholder="Describe the civic issue you've encountered..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isAnalyzing}
                className="mt-2 min-h-32"
              />
            </div>

            <div>
              <Label htmlFor="location" className="text-base font-semibold flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Location (Optional)
              </Label>
              <p className="text-sm text-muted-foreground mt-1 mb-2">
                Help us locate the issue for faster resolution
              </p>
              <div className="relative mt-2">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  placeholder="Enter address or landmark"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  disabled={isAnalyzing}
                  className="pl-10"
                />
              </div>
            </div>

            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || (!image && !description)}
              className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
              size="lg"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  <span className="text-lg">AI is Analyzing Your Report...</span>
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 mr-2" />
                  <span className="text-lg">Analyze with AI</span>
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {analysisResult && (
          <>
            <AnalysisResults result={analysisResult} />
            <div className="mt-6">
              <Card className="border-2 border-success/20 bg-success/5">
                <CardContent className="pt-6">
                  <Button onClick={handleSaveReport} disabled={isSaving} size="lg" className="w-full">
                    {isSaving ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        <span className="text-lg">Saving Report...</span>
                      </>
                    ) : (
                      <>
                        <FileText className="w-5 h-5 mr-2" />
                        <span className="text-lg">Save & Submit Report</span>
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </>
        )}
        </div>
      </div>
      </div>
    </div>
  );
};

export default Report;