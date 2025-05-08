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
