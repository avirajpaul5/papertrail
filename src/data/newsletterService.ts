import { supabase } from "../lib/supabase";
import { parse } from "rss-to-json";

// Updated interface to match your newsletters.ts file
export interface Newsletter {
  id: string;
  title: string;
  author: string;
  description: string;
  category: string;
  imageUrl: string;
  subscriberCount: number;
  frequency: string;
  website?: string;
  rssUrl?: string; // Added for RSS functionality
}

// For storing newsletter issues
export interface Issue {
  id?: string;
  title: string;
  content: string;
  published_at: string;
  url: string;
  author: string;
  newsletter_id: string;
  image_url?: string;
  snippet?: string;
  is_read?: boolean;
  is_favorite?: boolean;
}

// Static data for development
const STATIC_NEWSLETTERS: Newsletter[] = [
  {
    id: "stratechery",
    title: "Stratechery",
    author: "Ben Thompson",
    description:
      "Analysis of the strategy and business side of technology and media, and the impact of technology on society.",
    category: "Technology",
    imageUrl:
      "https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg",
    subscriberCount: 25000,
    frequency: "Weekly",
    website: "https://stratechery.com",
    rssUrl: "https://stratechery.com/feed/",
  },
  // ... convert other static newsletters to match this format
];

const isDevelopment = import.meta.env.DEV;

// Add pagination interface
export interface PaginationParams {
  page?: number;
  limit?: number;
}

// Add response interface for paginated results
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Enhanced getNewsletters with pagination
export async function getNewsletters(
  params?: PaginationParams
): Promise<PaginatedResponse<Newsletter>> {
  const page = params?.page || 1;
  const limit = params?.limit || 10;
  const offset = (page - 1) * limit;

  if (isDevelopment) {
    return {
      data: STATIC_NEWSLETTERS.slice(offset, offset + limit),
      total: STATIC_NEWSLETTERS.length,
      page,
      limit,
      totalPages: Math.ceil(STATIC_NEWSLETTERS.length / limit),
    };
  }

  try {
    // First get the total count
    const { count, error: countError } = await supabase
      .from("newsletters")
      .select("*", { count: "exact", head: true });

    if (countError) {
      console.error("Error getting newsletter count:", countError);
      throw countError;
    }

    // Then get the paginated data
    const { data, error } = await supabase
      .from("newsletters")
      .select("*")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("Error fetching newsletters:", error);
      throw error;
    }

    const total = count || 0;
    const totalPages = Math.ceil(total / limit);

    return {
      data: (data || []).map((item) => ({
        id: item.id,
        title: item.title || item.name,
        author: item.author || item.author_name,
        description: item.description,
        category: item.category || (item.categories ? item.categories[0] : ""),
        imageUrl: item.image_url || item.imageUrl,
        subscriberCount: item.subscriber_count || item.subscriberCount || 0,
        frequency: item.frequency,
        website: item.website || item.website_url,
        rssUrl: item.rss_url || item.rssUrl,
      })),
      total,
      page,
      limit,
      totalPages,
    };
  } catch (error) {
    console.error("Error in getNewsletters:", error);
    return {
      data: [],
      total: 0,
      page,
      limit,
      totalPages: 0,
    };
  }
}

// Add function to get newsletters by category
export async function getNewslettersByCategory(
  category: string,
  params?: PaginationParams
): Promise<PaginatedResponse<Newsletter>> {
  const page = params?.page || 1;
  const limit = params?.limit || 10;
  const offset = (page - 1) * limit;

  if (isDevelopment) {
    const filteredNewsletters = STATIC_NEWSLETTERS.filter(
      (n) => n.category.toLowerCase() === category.toLowerCase()
    );
    return {
      data: filteredNewsletters.slice(offset, offset + limit),
      total: filteredNewsletters.length,
      page,
      limit,
      totalPages: Math.ceil(filteredNewsletters.length / limit),
    };
  }

  try {
    // First get the total count
    const { count, error: countError } = await supabase
      .from("newsletters")
      .select("*", { count: "exact", head: true })
      .ilike("category", category);

    if (countError) {
      console.error("Error getting newsletter count by category:", countError);
      throw countError;
    }

    // Then get the paginated data
    const { data, error } = await supabase
      .from("newsletters")
      .select("*")
      .ilike("category", category)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("Error fetching newsletters by category:", error);
      throw error;
    }

    const total = count || 0;
    const totalPages = Math.ceil(total / limit);

    return {
      data: (data || []).map((item) => ({
        id: item.id,
        title: item.title || item.name,
        author: item.author || item.author_name,
        description: item.description,
        category: item.category || (item.categories ? item.categories[0] : ""),
        imageUrl: item.image_url || item.imageUrl,
        subscriberCount: item.subscriber_count || item.subscriberCount || 0,
        frequency: item.frequency,
        website: item.website || item.website_url,
        rssUrl: item.rss_url || item.rssUrl,
      })),
      total,
      page,
      limit,
      totalPages,
    };
  } catch (error) {
    console.error("Error in getNewslettersByCategory:", error);
    return {
      data: [],
      total: 0,
      page,
      limit,
      totalPages: 0,
    };
  }
}

export async function getNewsletterById(
  id: string
): Promise<Newsletter | null> {
  if (isDevelopment) {
    return STATIC_NEWSLETTERS.find((n) => n.id === id) || null;
  }

  const { data, error } = await supabase
    .from("newsletters")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching newsletter:", error);
    return null;
  }

  // Map to our interface
  return data
    ? {
        id: data.id,
        title: data.title || data.name,
        author: data.author || data.author_name,
        description: data.description,
        category: data.category || (data.categories ? data.categories[0] : ""),
        imageUrl: data.image_url || data.imageUrl,
        subscriberCount: data.subscriber_count || data.subscriberCount || 0,
        frequency: data.frequency,
        website: data.website || data.website_url,
        rssUrl: data.rss_url || data.rssUrl,
      }
    : null;
}

export async function createNewsletter(
  newsletter: Omit<Newsletter, "id">
): Promise<Newsletter | null> {
  // Map to database field names if needed
  const dbNewsletter = {
    title: newsletter.title,
    author: newsletter.author,
    description: newsletter.description,
    category: newsletter.category,
    image_url: newsletter.imageUrl,
    subscriber_count: newsletter.subscriberCount,
    frequency: newsletter.frequency,
    website: newsletter.website,
    rss_url: newsletter.rssUrl,
  };

  const { data, error } = await supabase
    .from("newsletters")
    .insert([dbNewsletter])
    .select()
    .single();

  if (error) {
    console.error("Error creating newsletter:", error);
    return null;
  }

  // Map back to our interface
  return data
    ? {
        id: data.id,
        title: data.title,
        author: data.author,
        description: data.description,
        category: data.category,
        imageUrl: data.image_url,
        subscriberCount: data.subscriber_count,
        frequency: data.frequency,
        website: data.website,
        rssUrl: data.rss_url,
      }
    : null;
}

export async function updateNewsletter(
  id: string,
  newsletter: Partial<Newsletter>
): Promise<Newsletter | null> {
  // Map to database field names
  const dbNewsletter: Record<string, any> = {};

  if (newsletter.title) dbNewsletter.title = newsletter.title;
  if (newsletter.author) dbNewsletter.author = newsletter.author;
  if (newsletter.description) dbNewsletter.description = newsletter.description;
  if (newsletter.category) dbNewsletter.category = newsletter.category;
  if (newsletter.imageUrl) dbNewsletter.image_url = newsletter.imageUrl;
  if (newsletter.subscriberCount)
    dbNewsletter.subscriber_count = newsletter.subscriberCount;
  if (newsletter.frequency) dbNewsletter.frequency = newsletter.frequency;
  if (newsletter.website) dbNewsletter.website = newsletter.website;
  if (newsletter.rssUrl) dbNewsletter.rss_url = newsletter.rssUrl;

  const { data, error } = await supabase
    .from("newsletters")
    .update(dbNewsletter)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating newsletter:", error);
    return null;
  }

  // Map back to our interface
  return data
    ? {
        id: data.id,
        title: data.title,
        author: data.author,
        description: data.description,
        category: data.category,
        imageUrl: data.image_url,
        subscriberCount: data.subscriber_count,
        frequency: data.frequency,
        website: data.website,
        rssUrl: data.rss_url,
      }
    : null;
}

export async function deleteNewsletter(id: string): Promise<boolean> {
  const { error } = await supabase.from("newsletters").delete().eq("id", id);

  if (error) {
    console.error("Error deleting newsletter:", error);
    return false;
  }

  return true;
}

// Fetch RSS feed and parse it
export async function fetchRssFeed(feedUrl: string): Promise<Issue[]> {
  console.log("Fetching RSS feed from:", feedUrl);
  try {
    const { data, error } = await supabase.functions.invoke("fetch-rss", {
      body: { feedUrl },
    });

    if (error) {
      console.error("Error fetching RSS feed:", error);
      return [];
    }

    console.log("Successfully fetched RSS feed:", {
      title: data.title,
      itemCount: data.items?.length || 0,
    });

    const issues = data.items.map((item: any) => ({
      title: item.title || "Untitled",
      content: item.content || item.description || "",
      published_at: item.pubDate || item.published || new Date().toISOString(),
      url: item.link || "",
      author: item.author || item.creator || data.title || "Unknown",
      newsletter_id: "", // This will need to be filled in by the calling function
      image_url: extractImageFromContent(
        item.content || item.description || ""
      ),
      snippet: createSnippet(item.content || item.description || ""),
    }));

    console.log("Processed issues:", issues.length);
    return issues;
  } catch (error) {
    console.error("Error in fetchRssFeed:", error);
    return [];
  }
}

// Helper to extract the first image from content
function extractImageFromContent(content: string): string {
  const imgRegex = /<img[^>]+src="([^">]+)"/;
  const match = content.match(imgRegex);
  return match ? match[1] : "";
}

// Create a short snippet from content
function createSnippet(content: string): string {
  // Remove HTML tags and get first 200 characters
  const plainText = content.replace(/<[^>]+>/g, "").trim();
  return plainText.substring(0, 200) + (plainText.length > 200 ? "..." : "");
}

// Sync a newsletter's issues from its RSS feed
export async function syncNewsletterIssues(
  newsletterId: string
): Promise<boolean> {
  try {
    // First get the newsletter to get its RSS feed URL
    const newsletter = await getNewsletterById(newsletterId);
    if (!newsletter || !newsletter.rssUrl) {
      console.error("Newsletter not found or has no RSS URL");
      return false;
    }

    // Fetch the feed
    const issues = await fetchRssFeed(newsletter.rssUrl);
    if (!issues.length) return false;

    // Add newsletter ID to each issue
    const issuesToInsert = issues.map((issue) => ({
      ...issue,
      newsletter_id: newsletterId,
    }));

    // Insert into database, skipping any that already exist
    const { error } = await supabase.from("issues").upsert(issuesToInsert, {
      onConflict: "newsletter_id, url", // Assumes unique constraint on these fields
      ignoreDuplicates: true,
    });

    if (error) {
      console.error("Error syncing issues:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in syncNewsletterIssues:", error);
    return false;
  }
}

// Schedule RSS syncs for all newsletters
export async function scheduleRssSyncs(): Promise<void> {
  // Get all newsletters with RSS URLs
  const { data: newsletters, error } = await supabase
    .from("newsletters")
    .select("id, rss_url")
    .not("rss_url", "is", null);

  if (error || !newsletters) {
    console.error("Error fetching newsletters for RSS sync:", error);
    return;
  }

  // Sync each newsletter's RSS feed
  for (const newsletter of newsletters) {
    await syncNewsletterIssues(newsletter.id);
  }
}

// Add a test function to verify RSS fetching
export async function testRssFetching(): Promise<void> {
  console.log("Testing RSS feed fetching...");

  // Test with a known good RSS feed
  const testFeedUrl = "https://stratechery.com/feed/";

  try {
    const issues = await fetchRssFeed(testFeedUrl);
    console.log("Test results:", {
      success: issues.length > 0,
      issuesCount: issues.length,
      firstIssue: issues[0]
        ? {
            title: issues[0].title,
            published_at: issues[0].published_at,
            author: issues[0].author,
          }
        : null,
    });
  } catch (error) {
    console.error("Test failed:", error);
  }
}
