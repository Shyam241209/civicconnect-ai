import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrl, description, locationData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Starting AI analysis for civic issue");

    // Construct the AI analysis messages
    const messages: any[] = [
      {
        role: "system",
        content: `You are an intelligent civic assistant integrated into a Crowdsourced Civic Issue Reporting and Resolution System.

Your goal is to analyze citizen-submitted reports and automatically detect civic issues from images and descriptions.

CRITICAL: First determine if the image/description represents a valid civic issue.

Return ONLY valid JSON (no markdown, no extra text) in this exact format:
{
  "is_valid_civic_issue": true/false,
  "validation_message": "string",
  "issue_category": "string",
  "severity": "string",
  "priority_level": "string",
  "short_description": "string",
  "suggested_department": "string",
  "context_analysis": "string",
  "estimated_resolution_time": "string",
  "recommended_action": "string",
  "ai_confidence_score": 0.95,
  "detected_objects": ["object1", "object2"]
}

Guidelines for Validation:
- is_valid_civic_issue: true only if image shows: potholes, broken infrastructure, garbage/waste, water leakage, damaged roads, broken street lights, public property damage, illegal dumping, drainage issues, graffiti, damaged footpaths, traffic issues
- is_valid_civic_issue: false if image shows: selfies, animals, random scenery, food, personal items, unrelated objects, unclear/blurry non-civic content
- validation_message: Clear message for users (e.g., "Valid civic issue detected" or "This photo does not appear to show a valid civic issue. Please upload a relevant image.")

Guidelines for Valid Issues:
- severity must be one of: "minor", "moderate", "critical"
- priority_level must be one of: "low", "medium", "high"
- issue_category examples: pothole, garbage overflow, broken streetlight, water leakage, tree fall, road blockage, drainage issue, damaged footpath, public property damage, illegal dumping, graffiti
- suggested_department examples: Public Works, Sanitation, Electrical, Water Supply, Parks and Trees, Traffic Management, Building Department
- ai_confidence_score must be between 0 and 1
- detected_objects: list specific objects/issues found in the image
- Be professional, concise, and action-ready`,
      },
    ];

    // Add user content
    const userContent: any[] = [];
    
    if (description) {
      userContent.push({
        type: "text",
        text: `User description: ${description}`,
      });
    }

    if (locationData) {
      userContent.push({
        type: "text",
        text: `Location: ${JSON.stringify(locationData)}`,
      });
    }

    if (imageUrl) {
      userContent.push({
        type: "image_url",
        image_url: {
          url: imageUrl,
        },
      });
    }

    messages.push({
      role: "user",
      content: userContent,
    });

    console.log("Calling Lovable AI Gateway");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: messages,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log("AI Response:", aiResponse);

    // Parse the AI response as JSON
    let analysisResult;
    try {
      // Remove markdown code blocks if present
      const cleanedResponse = aiResponse.replace(/```json\n?|\n?```/g, "").trim();
      analysisResult = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error("Failed to parse AI response:", aiResponse);
      throw new Error("AI returned invalid JSON format");
    }

    console.log("Analysis complete");

    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in analyze-civic-issue function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});