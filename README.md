# Papertrail - Your Newsletter Hub

<img src="/public/papertrail.svg" alt="Papertrail Logo" width="100" height="100">

Papertrail is a modern web application that helps users discover, organize, and read newsletters in one centralized platform. Say goodbye to cluttered inboxes and hello to a clean, distraction-free reading experience.

## 🚀 Key Features

- **Newsletter Discovery**: Explore curated newsletters across various topics and categories
- **Reading Experience**: Clean, distraction-free reading interface optimized for content consumption
- **Library Management**: Save and organize your favorite newsletters in your personal library
- **RSS Integration**: Server-side RSS feed parsing via Supabase Edge Functions
- **User Authentication**: Secure login and signup functionality
- **Responsive Design**: Fully responsive interface that works on desktop and mobile devices

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16+)
- npm or yarn
- [Supabase](https://supabase.com/) account (for backend functionality)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/papertrail.git
   cd papertrail
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   
   Create a `.env` file in the root directory with the following variables:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser** and navigate to `http://localhost:5173`

## 🗄️ Supabase Setup

1. **Create a Supabase project** at [supabase.com](https://supabase.com/)

2. **Run the migrations** in `supabase/migrations` to set up your database schema:
   ```bash
   supabase login
   supabase link --project-ref your-project-ref
   supabase db push
   ```

3. **Deploy the Edge Functions**:
   ```bash
   supabase functions deploy fetch-rss
   supabase functions deploy rss-ingestion
   ```

## 🏗️ Project Structure

```
papertrail/
├── public/                  # Static assets
├── src/                     # Frontend source code
│   ├── components/          # Reusable UI components
│   │   ├── common/          # Common UI elements
│   │   └── layout/          # Layout components
│   ├── context/             # React context providers
│   ├── data/                # Data models and services
│   ├── lib/                 # Utility libraries
│   ├── pages/               # Application pages/routes
│   ├── App.tsx              # Main application component
│   ├── index.css            # Global styles
│   └── main.tsx             # Application entry point
├── supabase/                # Supabase configuration
│   ├── functions/           # Edge Functions
│   │   ├── fetch-rss/       # RSS fetching function
│   │   └── rss-ingestion/   # RSS processing function
│   └── migrations/          # Database migrations
├── .env                     # Environment variables (create this)
├── index.html               # HTML entry point
├── package.json             # Project dependencies
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── vite.config.ts           # Vite configuration
```

## 🛠️ Tech Stack

- **Frontend**:
  - [React](https://reactjs.org/) - UI library
  - [TypeScript](https://www.typescriptlang.org/) - Type safety
  - [Vite](https://vitejs.dev/) - Build tool and development server
  - [React Router](https://reactrouter.com/) - Routing
  - [GSAP](https://greensock.com/gsap/) - Animations
  - [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

- **Backend**:
  - [Supabase](https://supabase.com/) - Backend-as-a-Service
    - Authentication
    - PostgreSQL Database
    - Edge Functions
  - [rss-to-json](https://www.npmjs.com/package/rss-to-json) - RSS parsing

## 📝 Usage Examples

### Exploring Newsletters

Navigate to the Explore page to discover curated newsletters across various categories:

```typescript
// Example of fetching newsletters
const { data: newsletters } = await supabase
  .from('newsletters')
  .select('*')
  .order('subscriber_count', { ascending: false });
```

### Reading Newsletter Content

The Reader page provides a clean, distraction-free reading experience:

```typescript
// Example of accessing a newsletter issue
const { newsletterId, issueId } = useParams();
const issue = await getIssueById(newsletterId, issueId);
```

### Managing Your Library

Add newsletters to your personal library for easy access:

```typescript
// Example of subscribing to a newsletter
const subscribeToNewsletter = async (newsletterId) => {
  const newSubscriptions = [...subscribedNewsletters, newsletterId];
  setSubscribedNewsletters(newSubscriptions);
  localStorage.setItem(`subscriptions-${user.id}`, JSON.stringify(newSubscriptions));
};
```

## 🤝 Contributing

Contributions are welcome! Here's how you can contribute:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

Please make sure to update tests as appropriate and adhere to the existing coding style.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [Supabase](https://supabase.com/) for the backend infrastructure
- [Tailwind CSS](https://tailwindcss.com/) for the styling framework
- [GSAP](https://greensock.com/gsap/) for animations
- [React](https://reactjs.org/) and the React ecosystem
