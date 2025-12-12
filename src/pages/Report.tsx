import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Upload, MapPin, Camera, FileText, Zap, AlertCircle, Locate } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AnalysisResults } from "@/components/AnalysisResults";
import { Navigation } from "@/components/Navigation";
import { useTranslation } from "@/hooks/use-translation";
import reportPortalBg from "@/assets/report-portal-bg.jpg";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

interface AnalysisResult {
  is_valid_civic_issue: boolean;
  validation_message: string;
  issue_category: string;
  severity: string;
  priority_level: string;
  short_description: string;
  suggested_department: string;
  context_analysis: string;
  estimated_resolution_time: string;
  recommended_action: string;
  ai_confidence_score: number;
  detected_objects?: string[];
}

const Report = () => {
  const { t } = useTranslation();
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [locationCoords, setLocationCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isInvalidImage, setIsInvalidImage] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Map refs
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);

  // Initialize map
  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: "https://demotiles.maplibre.org/style.json",
        center: [78.14, 11.65],
        zoom: 12,
      });

      map.addControl(new maplibregl.NavigationControl(), "top-right");

      // Handle map click to select location
      map.on("click", (e) => {
        const { lng, lat } = e.lngLat;
        setLocationCoords({ lat, lng });
        setLocation(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);

        // Update or create marker
        if (markerRef.current) {
          markerRef.current.setLngLat([lng, lat]);
        } else {
          markerRef.current = new maplibregl.Marker({ color: "#F58220" })
            .setLngLat([lng, lat])
            .addTo(map);
        }

        toast({
          title: t("locationCaptured"),
          description: `Coordinates: ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        });
      });

      mapRef.current = map;
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setIsInvalidImage(false);
      setAnalysisResult(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      toast({
        title: t("analyzing"),
        description: t("analyzing"),
      });
      await analyzeImage(file);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: t("locationError"),
        description: "Geolocation is not supported by your browser",
        variant: "destructive",
      });
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setLocationCoords(coords);
        setLocation(`${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`);
        setIsGettingLocation(false);

        // Update map view and marker
        if (mapRef.current) {
          mapRef.current.flyTo({
            center: [coords.lng, coords.lat],
            zoom: 15,
          });

          if (markerRef.current) {
            markerRef.current.setLngLat([coords.lng, coords.lat]);
          } else {
            markerRef.current = new maplibregl.Marker({ color: "#F58220" })
              .setLngLat([coords.lng, coords.lat])
              .addTo(mapRef.current);
          }
        }

        toast({
          title: t("locationCaptured"),
          description: "GPS coordinates captured successfully",
        });
      },
      (error) => {
        console.error("Error getting location:", error);
        setIsGettingLocation(false);
        toast({
          title: t("locationError"),
          description: "Could not retrieve your location. Please click on the map.",
          variant: "destructive",
        });
      }
    );
  };

  const analyzeImage = async (imageFile: File) => {
    setIsAnalyzing(true);
    
    try {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("civic-reports")
        .upload(fileName, imageFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("civic-reports")
        .getPublicUrl(fileName);

      const locationData = locationCoords
        ? { ...locationCoords, address: location }
        : location
        ? { address: location }
        : null;

      const { data, error } = await supabase.functions.invoke("analyze-civic-issue", {
        body: {
          imageUrl: publicUrl,
          description: description || null,
          locationData,
        },
      });

      if (error) throw error;

      if (!data.is_valid_civic_issue) {
        setIsInvalidImage(true);
        toast({
          title: "Invalid Civic Issue",
          description: data.validation_message,
          variant: "destructive",
        });
        setAnalysisResult(null);
      } else {
        setIsInvalidImage(false);
        setAnalysisResult(data);
        
        if (!description && data.short_description) {
          setDescription(data.short_description);
        }
        
        toast({
          title: t("aiAnalysis"),
          description: `${t("detectedObjects")}: ${data.issue_category}`,
        });
      }
    } catch (error) {
      console.error("Error analyzing image:", error);
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReanalyze = async () => {
    if (!image && !description) {
      toast({
        title: "Missing Information",
        description: "Please provide either an image or description",
        variant: "destructive",
      });
      return;
    }

    if (image) {
      await analyzeImage(image);
    }
  };

  const handleSaveReport = async () => {
    if (!analysisResult || !analysisResult.is_valid_civic_issue) {
      toast({
        title: "Cannot Submit",
        description: "Please upload a valid civic issue image",
        variant: "destructive",
      });
      return;
    }

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

      const locationData = locationCoords
        ? { ...locationCoords, address: location }
        : location
        ? { address: location }
        : null;

      const { error: insertError } = await supabase.from("civic_reports").insert({
        user_id: user.id,
        image_url: imageUrl,
        user_description: description,
        location_data: locationData,
        issue_category: analysisResult.issue_category,
        severity: analysisResult.severity,
        priority_level: analysisResult.priority_level,
        short_description: analysisResult.short_description,
        suggested_department: analysisResult.suggested_department,
        context_analysis: analysisResult.context_analysis,
        estimated_resolution_time: analysisResult.estimated_resolution_time,
        recommended_action: analysisResult.recommended_action,
        ai_confidence_score: analysisResult.ai_confidence_score,
      });

      if (insertError) throw insertError;

      toast({
        title: t("submitReport"),
        description: "Report submitted successfully",
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
        <img src={reportPortalBg} alt="Report Portal Background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/85 backdrop-blur-sm" />
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
              {t("reportTitle")}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("heroDescription")}
            </p>
          </div>

          {/* Progress Indicators */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Card className={`border-2 ${!analysisResult ? 'border-primary bg-primary/5' : 'border-border'}`}>
              <CardContent className="pt-6 pb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${!analysisResult ? 'bg-primary' : 'bg-muted'}`}>
                    <Camera className={`w-5 h-5 ${!analysisResult ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                  </div>
                  <div>
                    <h3 className={`font-semibold ${!analysisResult ? '' : 'text-muted-foreground'}`}>1. {t("capturePhoto")}</h3>
                    <p className="text-sm text-muted-foreground">{t("uploadPhoto")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className={`border-2 ${isAnalyzing ? 'border-primary bg-primary/5' : 'border-border'}`}>
              <CardContent className="pt-6 pb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isAnalyzing ? 'bg-primary' : 'bg-muted'}`}>
                    <Zap className={`w-5 h-5 ${isAnalyzing ? 'text-primary-foreground animate-pulse' : 'text-muted-foreground'}`} />
                  </div>
                  <div>
                    <h3 className={`font-semibold ${isAnalyzing ? '' : 'text-muted-foreground'}`}>2. {t("aiAnalysis")}</h3>
                    <p className="text-sm text-muted-foreground">{isAnalyzing ? t("analyzing") : t("aiAnalysis")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className={`border-2 ${analysisResult?.is_valid_civic_issue ? 'border-primary bg-primary/5' : 'border-border'}`}>
              <CardContent className="pt-6 pb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${analysisResult?.is_valid_civic_issue ? 'bg-primary' : 'bg-muted'}`}>
                    <FileText className={`w-5 h-5 ${analysisResult?.is_valid_civic_issue ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                  </div>
                  <div>
                    <h3 className={`font-semibold ${analysisResult?.is_valid_civic_issue ? '' : 'text-muted-foreground'}`}>3. {t("confirmSubmit")}</h3>
                    <p className="text-sm text-muted-foreground">{t("submitReport")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Invalid Image Warning */}
          {isInvalidImage && (
            <Card className="mb-6 border-2 border-destructive bg-destructive/5">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-destructive mb-1">{t("invalidImageWarning")}</h3>
                    <p className="text-sm text-muted-foreground">
                      {analysisResult?.validation_message || t("invalidImageWarning")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="mb-6 border-2 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
              <CardTitle className="text-3xl flex items-center gap-3">
                <Camera className="w-8 h-8 text-primary" />
                {t("reportTitle")}
              </CardTitle>
              <CardDescription className="text-base">
                {t("dragDropPhoto")}
              </CardDescription>
            </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div>
              <Label htmlFor="image" className="text-base font-semibold flex items-center gap-2">
                <Camera className="w-4 h-4" />
                {t("uploadPhoto")}
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
                {analysisResult?.is_valid_civic_issue && (
                  <span className="text-xs font-normal text-muted-foreground">(Auto-filled by AI)</span>
                )}
              </Label>
              <p className="text-sm text-muted-foreground mt-1 mb-2">
                AI has detected the issue. You can modify the description if needed.
              </p>
              <Textarea
                id="description"
                placeholder="Describe the civic issue you've encountered..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isAnalyzing}
                className="mt-2 min-h-32"
              />
              {analysisResult?.detected_objects && analysisResult.detected_objects.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="text-xs text-muted-foreground">Detected:</span>
                  {analysisResult.detected_objects.map((obj, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {obj}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Location Section with Map */}
            <div>
              <Label className="text-base font-semibold flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Location (Click on map or use current location)
              </Label>
              <p className="text-sm text-muted-foreground mt-1 mb-2">
                Click on the map to select location or use the button to get your current location
              </p>
              
              <div className="flex gap-2 mb-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={getCurrentLocation}
                  disabled={isGettingLocation || isAnalyzing}
                  className="flex-shrink-0"
                >
                  {isGettingLocation ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Locate className="w-4 h-4 mr-2" />
                  )}
                  Use Current Location
                </Button>
                <Input
                  id="location"
                  placeholder="Coordinates will appear here..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  disabled={isAnalyzing}
                  className="flex-1"
                />
              </div>

              {/* MapLibre Map */}
              <Card className="overflow-hidden">
                <div
                  ref={mapContainerRef}
                  className="w-full h-[300px]"
                  style={{ minHeight: "300px" }}
                />
              </Card>
              {locationCoords && (
                <p className="text-xs text-muted-foreground mt-2">
                  Selected: Lat {locationCoords.lat.toFixed(6)}, Lng {locationCoords.lng.toFixed(6)}
                </p>
              )}
            </div>

            {analysisResult && !analysisResult.is_valid_civic_issue && (
              <Button
                onClick={handleReanalyze}
                disabled={isAnalyzing || !image}
                variant="outline"
                className="w-full"
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    <span className="text-lg">Re-analyzing...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-2" />
                    <span className="text-lg">Try Different Photo</span>
                  </>
                )}
              </Button>
            )}
          </CardContent>
        </Card>

        {analysisResult && analysisResult.is_valid_civic_issue && (
          <>
            <AnalysisResults result={analysisResult} />
            <div className="mt-6">
              <Card className="border-2 border-primary/20 bg-primary/5">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-background/50 rounded-lg border">
                    <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-semibold mb-1">Please Confirm Details</h4>
                      <p className="text-sm text-muted-foreground">
                        Review the AI-detected information above. You can edit the description if needed before submitting.
                      </p>
                    </div>
                  </div>
                  <Button onClick={handleSaveReport} disabled={isSaving} size="lg" className="w-full">
                    {isSaving ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        <span className="text-lg">Saving Report...</span>
                      </>
                    ) : (
                      <>
                        <FileText className="w-5 h-5 mr-2" />
                        <span className="text-lg">Confirm & Submit Report</span>
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