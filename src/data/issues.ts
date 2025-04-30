import { supabase } from '../lib/supabase';

export interface Issue {
  id: string;
  newsletter_id: string; // This is a UUID string
  title: string;
  content: string;
  url?: string;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export async function getIssuesByNewsletterId(newsletterId: string): Promise<Issue[]> {
  // Validate UUID format before making the request
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(newsletterId)) {
    console.error('Invalid UUID format for newsletter_id');
    return [];
  }

  const { data, error } = await supabase
    .from('issues')
    .select('*')
    .eq('newsletter_id', newsletterId)
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching issues:', error);
    return [];
  }

  return data || [];
}

export async function getIssueById(issueId: string): Promise<Issue | null> {
  // Validate UUID format before making the request
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(issueId)) {
    console.error('Invalid UUID format for issue_id');
    return null;
  }

  const { data, error } = await supabase
    .from('issues')
    .select('*')
    .eq('id', issueId)
    .single();

  if (error) {
    console.error('Error fetching issue:', error);
    return null;
  }

  return data;
}