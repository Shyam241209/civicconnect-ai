import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Clock, TrendingUp, Building, CheckCircle } from "lucide-react";

interface AnalysisResultsProps {
  result: {
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
  };
}

export const AnalysisResults = ({ result }: AnalysisResultsProps) => {
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "default";
    }
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">AI Analysis Results</CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle className="w-4 h-4" />
            {Math.round(result.ai_confidence_score * 100)}% Confidence
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Category</div>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-primary" />
              <span className="font-semibold capitalize">{result.issue_category}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Department</div>
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-accent" />
              <span className="font-semibold">{result.suggested_department}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Severity</div>
            <Badge variant={getSeverityColor(result.severity)} className="capitalize">
              {result.severity}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Priority</div>
            <Badge variant={getPriorityColor(result.priority_level)} className="capitalize">
              {result.priority_level} Priority
            </Badge>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">Description</div>
          <p className="text-base">{result.short_description}</p>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">Context Analysis</div>
          <p className="text-sm text-muted-foreground">{result.context_analysis}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Clock className="w-4 h-4" />
              Estimated Resolution Time
            </div>
            <p className="font-semibold">{result.estimated_resolution_time}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <TrendingUp className="w-4 h-4" />
              Recommended Action
            </div>
            <p className="font-semibold">{result.recommended_action}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};