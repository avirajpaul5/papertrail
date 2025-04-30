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
}

export const newsletters: Newsletter[] = [
  {
    id: "stratechery",
    title: "Stratechery",
    author: "Ben Thompson",
    description:
      "Analysis of the strategy and business side of technology and media, and the impact of technology on society.",
    category: "Technology",
    imageUrl:
      "https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    subscriberCount: 25000,
    frequency: "Weekly",
    website: "https://stratechery.com",
  },
  {
    id: "morning-brew",
    title: "Morning Brew",
    author: "Morning Brew Team",
    description:
      "The daily email newsletter covering the latest news from Wall St. to Silicon Valley.",
    category: "Business",
    imageUrl:
      "https://images.pexels.com/photos/5186869/pexels-photo-5186869.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    subscriberCount: 4000000,
    frequency: "Daily",
    website: "https://morningbrew.com",
  },
  {
    id: "not-boring",
    title: "Not Boring",
    author: "Packy McCormick",
    description:
      "Business strategy and trends, but not boring. Deep dives into fascinating companies and trends.",
    category: "Business",
    imageUrl:
      "https://images.pexels.com/photos/5691622/pexels-photo-5691622.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    subscriberCount: 110000,
    frequency: "Weekly",
    website: "https://notboring.co",
  },
  {
    id: "brain-food",
    title: "Farnam Street Brain Food",
    author: "Shane Parrish",
    description:
      "Wisdom and mental models for better thinking and decision-making.",
    category: "Productivity",
    imageUrl:
      "https://images.pexels.com/photos/3184361/pexels-photo-3184361.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    subscriberCount: 500000,
    frequency: "Weekly",
    website: "https://fs.blog",
  },
  {
    id: "the-hustle",
    title: "The Hustle",
    author: "The Hustle Team",
    description:
      "Business and tech news in 5 minutes or less, delivered daily.",
    category: "Business",
    imageUrl:
      "https://images.pexels.com/photos/3182781/pexels-photo-3182781.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    subscriberCount: 2000000,
    frequency: "Daily",
    website: "https://thehustle.co",
  },
  {
    id: "product-hunt",
    title: "Product Hunt Daily",
    author: "Product Hunt Team",
    description:
      "A daily digest of the best new products, sent straight to your inbox.",
    category: "Technology",
    imageUrl:
      "https://images.pexels.com/photos/4339678/pexels-photo-4339678.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    subscriberCount: 500000,
    frequency: "Daily",
    website: "https://www.producthunt.com",
  },
  {
    id: "dense-discovery",
    title: "Dense Discovery",
    author: "Kai Brach",
    description:
      "A weekly newsletter helping you be productive, feel inspired, and think critically.",
    category: "Design",
    imageUrl:
      "https://images.pexels.com/photos/3194523/pexels-photo-3194523.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    subscriberCount: 42000,
    frequency: "Weekly",
    website: "https://densediscovery.com",
  },
  {
    id: "trends",
    title: "Trends",
    author: "The Hustle Team",
    description:
      "Emerging business trends and opportunities in the market before they go mainstream.",
    category: "Business",
    imageUrl:
      "https://images.pexels.com/photos/6476254/pexels-photo-6476254.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    subscriberCount: 10000,
    frequency: "Weekly",
    website: "https://trends.co",
  },
];

/**
 * Get a newsletter by its slug (ID)
 * @param slug The newsletter ID used as a slug in the URL
 * @returns The newsletter object or undefined if not found
 */
export function getNewsletterBySlug(slug: string): Newsletter | undefined {
  return newsletters.find((newsletter) => newsletter.id === slug);
}
