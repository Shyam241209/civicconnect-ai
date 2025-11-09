import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2, Calendar, MapPin } from "lucide-react";
import { format } from "date-fns";

interface Report {
  id: string;
  image_url: string | null;
  user_description: string;
  issue_category: string;
  severity: string;
  priority_level: string;
  short_description: string;
  suggested_department: string;
  status: string;
  created_at: string;
  location_data: any;
}

const Dashboard = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from("civic_reports")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setReports(data || []);
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast({
        title: "Error",
        description: "Failed to load reports",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "destructive";
      case "moderate":
        return "default";
      case "minor":
        return "secondary";
      default:
        return "default";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "default";
      case "in_progress":
        return "default";
      case "pending":
        return "secondary";
      case "rejected":
        return "destructive";
      default:
        return "secondary";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button variant="ghost" asChild className="mb-4">
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            <h1 className="text-4xl font-bold">Reports Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              View and track all civic issue reports
            </p>
          </div>
          <Button asChild size="lg">
            <Link to="/report">Submit New Report</Link>
          </Button>
        </div>

        {reports.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <p className="text-xl text-muted-foreground mb-4">
                No reports submitted yet
              </p>
              <Button asChild>
                <Link to="/report">Submit First Report</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {reports.map((report) => (
              <Card key={report.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="md:flex">
                  {report.image_url && (
                    <div className="md:w-1/3">
                      <img
                        src={report.image_url}
                        alt="Report"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className={report.image_url ? "md:w-2/3" : "w-full"}>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2">
                            {report.issue_category}
                          </CardTitle>
                          <CardDescription className="text-base">
                            {report.short_description}
                          </CardDescription>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Badge variant={getSeverityColor(report.severity)}>
                            {report.severity}
                          </Badge>
                          <Badge variant={getStatusColor(report.status)}>
                            {report.status.replace("_", " ")}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(report.created_at), "MMM dd, yyyy")}
                        </div>
                        {report.location_data?.address && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {report.location_data.address}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 text-sm">
                        <span className="font-medium">Department:</span>
                        <span className="text-muted-foreground">
                          {report.suggested_department}
                        </span>
                      </div>
                      <div className="flex gap-2 text-sm">
                        <span className="font-medium">Priority:</span>
                        <span className="text-muted-foreground capitalize">
                          {report.priority_level}
                        </span>
                      </div>
                    </CardContent>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;