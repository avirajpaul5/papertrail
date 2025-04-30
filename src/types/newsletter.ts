export interface Newsletter {
  id: string;
  name: string;
  author_name: string;
  description: string;
  categories: string[];
  tags: string[];
  image_url: string;
  website_url?: string;
  subscriber_count: number;
  frequency: string;
  created_at?: string;
  updated_at?: string;
}
