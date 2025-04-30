import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { parse } from 'npm:rss-parser@3.13.0';
import { createClient } from 'npm:@supabase/supabase-js@2.39.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get all newsletters with RSS feeds
    const { data: newsletters, error: newslettersError } = await supabase
      .from('newsletters')
      .select('id, website_url')
      .not('website_url', 'is', null);

    if (newslettersError) throw newslettersError;

    const parser = new parse();
    
    for (const newsletter of newsletters) {
      try {
        const feed = await parser.parseURL(newsletter.website_url);
        
        for (const item of feed.items) {
          if (!item.title || !item.content || !item.link || !item.pubDate) {
            continue;
          }

          // Insert new issue
          const { error: insertError } = await supabase
            .from('issues')
            .insert({
              newsletter_id: newsletter.id,
              title: item.title,
              content: item.content,
              url: item.link,
              published_at: new Date(item.pubDate).toISOString(),
            })
            .select()
            .single();

          // Ignore unique constraint violations (already imported)
          if (insertError && !insertError.message.includes('unique constraint')) {
            console.error(`Error inserting issue: ${insertError.message}`);
          }
        }
      } catch (err) {
        console.error(`Error processing feed for newsletter ${newsletter.id}: ${err}`);
      }
    }

    return new Response(
      JSON.stringify({ message: 'RSS ingestion completed' }), 
      { 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );
  } catch (err) {
    console.error('Error in RSS ingestion:', err);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }), 
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    );
  }
});