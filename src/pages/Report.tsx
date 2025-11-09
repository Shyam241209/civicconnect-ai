import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Upload, MapPin, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { AnalysisResults } from "@/components/AnalysisResults";

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
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </Button>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-3xl">Report Civic Issue</CardTitle>
            <CardDescription className="text-base">
              Upload an image and/or describe the issue for AI-powered analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="image" className="text-base">Issue Photo (Optional)</Label>
              <div className="mt-2">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={isAnalyzing}
                  className="cursor-pointer"
                />
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
              <Label htmlFor="description" className="text-base">Issue Description</Label>
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
              <Label htmlFor="location" className="text-base">Location (Optional)</Label>
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
              className="w-full"
              size="lg"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Analyze Issue
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {analysisResult && (
          <>
            <AnalysisResults result={analysisResult} />
            <div className="mt-6 flex justify-end">
              <Button onClick={handleSaveReport} disabled={isSaving} size="lg">
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Report"
                )}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Report;