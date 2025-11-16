import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { useTranslation } from "@/hooks/use-translation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, MapPin, Navigation2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import subpageBg from "@/assets/subpage-bg.jpg";

// Use a public token for demo - in production, this should be in environment variables
mapboxgl.accessToken = "pk.eyJ1IjoibG92YWJsZS1kZW1vIiwiYSI6ImNscHh5eHB4YjBhOGkya3BicjRlaDdkNWEifQ.VZ8YvVz9z9Z7QqQd_4XKYA";

interface CivicIssue {
  id: string;
  location_data: {
    lat?: number;
    lng?: number;
    address?: string;
  };
  issue_category: string;
  severity: string;
  short_description: string;
  status: string;
  created_at: string;
  image_url?: string;
}

const Map = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  
  const [issues, setIssues] = useState<CivicIssue[]>([]);
  const [filteredIssues, setFilteredIssues] = useState<CivicIssue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [selectedIssue, setSelectedIssue] = useState<CivicIssue | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    fetchIssues();
    getUserLocation();
  }, []);

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      initializeMap();
    }
  }, []);

  useEffect(() => {
    filterIssues();
  }, [issues, categoryFilter, severityFilter]);

  useEffect(() => {
    if (mapRef.current && filteredIssues.length > 0) {
      updateMarkers();
    }
  }, [filteredIssues]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  const fetchIssues = async () => {
    try {
      const { data, error } = await supabase
        .from("civic_reports")
        .select("*")
        .not("location_data", "is", null);

      if (error) throw error;

      // Filter issues that have valid coordinates and cast location_data properly
      const validIssues = (data || [])
        .map((issue) => ({
          ...issue,
          location_data: issue.location_data as any,
        }))
        .filter(
          (issue) => 
            issue.location_data && 
            typeof issue.location_data === 'object' &&
            'lat' in issue.location_data && 
            'lng' in issue.location_data
        ) as CivicIssue[];

      setIssues(validIssues);
    } catch (error) {
      console.error("Error fetching issues:", error);
      toast({
        title: "Error",
        description: "Failed to load civic issues",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const initializeMap = () => {
    if (!mapContainerRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [78.9629, 20.5937], // Center of India
      zoom: 4,
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");
    mapRef.current = map;
  };

  const filterIssues = () => {
    let filtered = [...issues];

    if (categoryFilter !== "all") {
      filtered = filtered.filter((issue) => issue.issue_category === categoryFilter);
    }

    if (severityFilter !== "all") {
      filtered = filtered.filter((issue) => issue.severity === severityFilter);
    }

    setFilteredIssues(filtered);
  };

  const updateMarkers = () => {
    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    if (!mapRef.current) return;

    // Add new markers
    filteredIssues.forEach((issue) => {
      if (!issue.location_data?.lat || !issue.location_data?.lng) return;

      const el = document.createElement("div");
      el.className = "marker";
      el.style.width = "30px";
      el.style.height = "30px";
      el.style.borderRadius = "50%";
      el.style.cursor = "pointer";
      el.style.border = "3px solid white";
      el.style.boxShadow = "0 2px 4px rgba(0,0,0,0.3)";
      
      // Color based on severity
      el.style.backgroundColor = getSeverityColor(issue.severity);

      const marker = new mapboxgl.Marker(el)
        .setLngLat([issue.location_data.lng, issue.location_data.lat])
        .addTo(mapRef.current!);

      el.addEventListener("click", () => {
        setSelectedIssue(issue);
        mapRef.current?.flyTo({
          center: [issue.location_data.lng!, issue.location_data.lat!],
          zoom: 15,
        });
      });

      markersRef.current.push(marker);
    });

    // Fit map to markers if there are any
    if (filteredIssues.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      filteredIssues.forEach((issue) => {
        if (issue.location_data?.lat && issue.location_data?.lng) {
          bounds.extend([issue.location_data.lng, issue.location_data.lat]);
        }
      });
      mapRef.current?.fitBounds(bounds, { padding: 50 });
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "#ef4444";
      case "moderate":
        return "#f59e0b";
      case "minor":
        return "#10b981";
      default:
        return "#6b7280";
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return "destructive";
      case "moderate":
        return "default";
      case "minor":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const showRouteToIssue = async (issue: CivicIssue) => {
    if (!userLocation || !mapRef.current) {
      toast({
        title: "Location Required",
        description: "Please enable location services to view route",
        variant: "destructive",
      });
      return;
    }

    if (!issue.location_data?.lat || !issue.location_data?.lng) return;

    try {
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${userLocation.lng},${userLocation.lat};${issue.location_data.lng},${issue.location_data.lat}?geometries=geojson&access_token=${mapboxgl.accessToken}`
      );

      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0].geometry;

        // Remove existing route layer if present
        if (mapRef.current.getLayer("route")) {
          mapRef.current.removeLayer("route");
          mapRef.current.removeSource("route");
        }

        // Add route to map
        mapRef.current.addLayer({
          id: "route",
          type: "line",
          source: {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: route,
            },
          },
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#3b82f6",
            "line-width": 5,
            "line-opacity": 0.8,
          },
        });

        // Fit map to route
        const bounds = new mapboxgl.LngLatBounds();
        route.coordinates.forEach((coord: [number, number]) => {
          bounds.extend(coord);
        });
        mapRef.current.fitBounds(bounds, { padding: 50 });

        toast({
          title: "Route Displayed",
          description: `Distance: ${(data.routes[0].distance / 1000).toFixed(2)} km`,
        });
      }
    } catch (error) {
      console.error("Error fetching route:", error);
      toast({
        title: "Error",
        description: "Failed to fetch route",
        variant: "destructive",
      });
    }
  };

  const categories = [...new Set(issues.map((issue) => issue.issue_category))];
  const severities = ["critical", "moderate", "minor"];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">{t("loadingMap")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0">
        <img src={subpageBg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/85 backdrop-blur-sm" />
      </div>
      <div className="relative z-10">
        <Navigation />

        <div className="pt-24 pb-12 px-4">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                {t("mapTitle")}
              </h1>
              <p className="text-xl text-muted-foreground">{t("mapSubtitle")}</p>
            </div>

            {/* Filters */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  {t("filterBy")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      {t("filterByCategory")}
                    </label>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t("allCategories")}</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      {t("filterBySeverity")}
                    </label>
                    <Select value={severityFilter} onValueChange={setSeverityFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t("allSeverities")}</SelectItem>
                        {severities.map((severity) => (
                          <SelectItem key={severity} value={severity}>
                            {t(severity)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="destructive" className="w-3 h-3 p-0" />
                  <span>{t("critical")}</span>
                  <Badge variant="default" className="w-3 h-3 p-0 ml-4" />
                  <span>{t("moderate")}</span>
                  <Badge variant="secondary" className="w-3 h-3 p-0 ml-4" />
                  <span>{t("minor")}</span>
                  <span className="ml-auto">
                    {filteredIssues.length} {filteredIssues.length === 1 ? "issue" : "issues"}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Map and Details Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Map */}
              <div className="lg:col-span-2">
                <Card className="overflow-hidden">
                  <div
                    ref={mapContainerRef}
                    className="w-full h-[600px]"
                    style={{ minHeight: "600px" }}
                  />
                </Card>
              </div>

              {/* Selected Issue Details */}
              <div>
                {selectedIssue ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        {t("issueDetails")}
                        <Badge variant={getSeverityBadge(selectedIssue.severity)}>
                          {t(selectedIssue.severity)}
                        </Badge>
                      </CardTitle>
                      <CardDescription>{selectedIssue.issue_category}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {selectedIssue.image_url && (
                        <img
                          src={selectedIssue.image_url}
                          alt="Issue"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      )}
                      <div>
                        <h4 className="font-semibold mb-2">Description</h4>
                        <p className="text-sm text-muted-foreground">
                          {selectedIssue.short_description}
                        </p>
                      </div>
                      {selectedIssue.location_data?.address && (
                        <div>
                          <h4 className="font-semibold mb-2">Location</h4>
                          <p className="text-sm text-muted-foreground">
                            {selectedIssue.location_data.address}
                          </p>
                        </div>
                      )}
                      <div>
                        <h4 className="font-semibold mb-2">{t("status")}</h4>
                        <Badge>{selectedIssue.status}</Badge>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">{t("reportedOn")}</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(selectedIssue.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        onClick={() => showRouteToIssue(selectedIssue)}
                        className="w-full"
                      >
                        <Navigation2 className="w-4 h-4 mr-2" />
                        {t("showRouteToIssue")}
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>{t("issueDetails")}</CardTitle>
                      <CardDescription>
                        Click on a marker to view issue details
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12 text-muted-foreground">
                        <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Select an issue on the map</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;
