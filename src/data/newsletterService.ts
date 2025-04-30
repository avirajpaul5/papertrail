import { supabase } from '../lib/supabase';
import type { Newsletter } from '../types/newsletter';

// Static data for development
const STATIC_NEWSLETTERS: Newsletter[] = [
  {
    id: 'stratechery',
    name: 'Stratechery',
    author_name: 'Ben Thompson',
    description: 'Analysis of the strategy and business side of technology and media, and the impact of technology on society.',
    categories: ['Technology', 'Business'],
    tags: ['tech', 'strategy', 'analysis'],
    image_url: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg',
    website_url: 'https://stratechery.com',
    subscriber_count: 25000,
    frequency: 'Weekly'
  },
  // ... convert other static newsletters to match this format
];

const isDevelopment = import.meta.env.DEV;

export async function getNewsletters(): Promise<Newsletter[]> {
  if (isDevelopment) {
    return STATIC_NEWSLETTERS;
  }

  const { data, error } = await supabase
    .from('newsletters')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching newsletters:', error);
    return [];
  }

  return data || [];
}

export async function getNewsletterById(id: string): Promise<Newsletter | null> {
  if (isDevelopment) {
    return STATIC_NEWSLETTERS.find(n => n.id === id) || null;
  }

  const { data, error } = await supabase
    .from('newsletters')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching newsletter:', error);
    return null;
  }

  return data;
}

export async function createNewsletter(newsletter: Omit<Newsletter, 'id' | 'created_at' | 'updated_at'>): Promise<Newsletter | null> {
  const { data, error } = await supabase
    .from('newsletters')
    .insert([newsletter])
    .select()
    .single();

  if (error) {
    console.error('Error creating newsletter:', error);
    return null;
  }

  return data;
}

export async function updateNewsletter(id: string, newsletter: Partial<Newsletter>): Promise<Newsletter | null> {
  const { data, error } = await supabase
    .from('newsletters')
    .update(newsletter)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating newsletter:', error);
    return null;
  }

  return data;
}

export async function deleteNewsletter(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('newsletters')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting newsletter:', error);
    return false;
  }

  return true;
}