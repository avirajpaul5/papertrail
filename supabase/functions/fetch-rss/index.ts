import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Parser from "https://esm.sh/rss-parser@3.12.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { feedUrl } = await req.json();

    if (!feedUrl) {
      return new Response(JSON.stringify({ error: "Feed URL is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const parser = new Parser({
      customFields: {
        item: [
          ["content:encoded", "content"],
          ["description", "description"],
        ],
      },
    });

    const feed = await parser.parseURL(feedUrl);

    return new Response(JSON.stringify(feed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
