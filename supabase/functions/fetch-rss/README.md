# Papertrail - Your Newsletter Hub

Papertrail is a modern web application that helps users discover, organize, and read newsletters in one centralized platform.

## Features

- **Newsletter Discovery**: Explore curated newsletters across various topics
- **Reading Experience**: Clean, distraction-free reading interface
- **Library Management**: Save and organize your favorite newsletters
- **RSS Integration**: Server-side RSS feed parsing via Supabase Edge Functions

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **Animations**: GSAP
- **Backend**: Supabase (Auth, Database, Edge Functions)
- **RSS Parsing**: rss-to-json

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Supabase account (for backend functionality)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/papertrail.git
cd papertrail
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Supabase Setup

1. Create a Supabase project
2. Run the migrations in `supabase/migrations`
3. Deploy the Edge Functions:
```bash
supabase login
supabase link --project-ref your-project-ref
supabase functions deploy fetch-rss
```

## Project Structure

- `/src` - Frontend source code
  - `/components` - Reusable UI components
  - `/context` - React context providers
  - `/data` - Data models and mock data
  - `/pages` - Application pages/routes
- `/supabase` - Supabase configuration
  - `/functions` - Edge Functions
  - `/migrations` - Database migrations

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
