import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Calendar, MapPin, Filter, Search, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { Navigation } from "@/components/Navigation";
import { Input } from "@/components/ui/input";
import dashboardBg from "@/assets/dashboard-bg.jpg";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
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

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.issue_category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.short_description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || report.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: reports.length,
    pending: reports.filter(r => r.status === "pending").length,
    inProgress: reports.filter(r => r.status === "in_progress").length,
    resolved: reports.filter(r => r.status === "resolved").length,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0">
        <img src={dashboardBg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/85 backdrop-blur-sm" />
      </div>
      <div className="relative z-10">
        <Navigation />
      
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header with Stats */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
                DASHBOARD
              </div>
              <h1 className="text-5xl font-bold mb-4">Reports Overview</h1>
              <p className="text-xl text-muted-foreground">
                Track and monitor all civic issue reports in real-time
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <Card className="border-2 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Reports</p>
                      <p className="text-3xl font-bold">{stats.total}</p>
                    </div>
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-2 hover:shadow-lg transition-shadow border-warning/20 bg-warning/5">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Pending</p>
                      <p className="text-3xl font-bold text-warning">{stats.pending}</p>
                    </div>
                    <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center">
                      <Loader2 className="w-6 h-6 text-warning" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-2 hover:shadow-lg transition-shadow border-primary/20 bg-primary/5">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">In Progress</p>
                      <p className="text-3xl font-bold text-primary">{stats.inProgress}</p>
                    </div>
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-2 hover:shadow-lg transition-shadow border-success/20 bg-success/5">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Resolved</p>
                      <p className="text-3xl font-bold text-success">{stats.resolved}</p>
                    </div>
                    <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filter */}
            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search reports..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={filterStatus === "all" ? "default" : "outline"}
                      onClick={() => setFilterStatus("all")}
                    >
                      All
                    </Button>
                    <Button
                      variant={filterStatus === "pending" ? "default" : "outline"}
                      onClick={() => setFilterStatus("pending")}
                    >
                      Pending
                    </Button>
                    <Button
                      variant={filterStatus === "in_progress" ? "default" : "outline"}
                      onClick={() => setFilterStatus("in_progress")}
                    >
                      In Progress
                    </Button>
                    <Button
                      variant={filterStatus === "resolved" ? "default" : "outline"}
                      onClick={() => setFilterStatus("resolved")}
                    >
                      Resolved
                    </Button>
                  </div>
                  <Button asChild>
                    <Link to="/report">New Report</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

        {filteredReports.length === 0 ? (
          <Card className="border-2">
            <CardContent className="py-20 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-xl text-muted-foreground mb-2">
                {searchTerm || filterStatus !== "all" ? "No reports match your filters" : "No reports submitted yet"}
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                {searchTerm || filterStatus !== "all" ? "Try adjusting your search or filters" : "Be the first to report a civic issue"}
              </p>
              <Button asChild>
                <Link to="/report">Submit First Report</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {filteredReports.map((report) => (
              <Card key={report.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/30 group">
                <div className="md:flex">
                  {report.image_url && (
                    <div className="md:w-1/3 relative overflow-hidden">
                      <img
                        src={report.image_url}
                        alt="Report"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  )}
                  <div className={report.image_url ? "md:w-2/3" : "w-full"}>
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant={getSeverityColor(report.severity)} className="text-xs">
                              {report.severity}
                            </Badge>
                            <Badge variant={getStatusColor(report.status)} className="text-xs">
                              {report.status.replace("_", " ")}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {report.priority_level}
                            </Badge>
                          </div>
                          <CardTitle className="text-2xl mb-2 group-hover:text-primary transition-colors">
                            {report.issue_category}
                          </CardTitle>
                          <CardDescription className="text-base leading-relaxed">
                            {report.short_description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          <span>{format(new Date(report.created_at), "MMM dd, yyyy")}</span>
                        </div>
                        {report.location_data?.address && (
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4" />
                            <span>{report.location_data.address}</span>
                          </div>
                        )}
                      </div>
                      <div className="grid md:grid-cols-2 gap-3 text-sm">
                        <div className="flex gap-2">
                          <span className="font-semibold">Department:</span>
                          <span className="text-muted-foreground">
                            {report.suggested_department}
                          </span>
                        </div>
                        {report.user_description && (
                          <div className="flex gap-2">
                            <span className="font-semibold">User Notes:</span>
                            <span className="text-muted-foreground truncate">
                              {report.user_description}
                            </span>
                          </div>
                        )}
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
      </div>
    </div>
  );
};

export default Dashboard;