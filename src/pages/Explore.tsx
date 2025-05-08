import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { Search, Filter } from "lucide-react";
import NewsletterCard from "../components/newsletters/NewsletterCard";
import RecommendationSection from "../components/newsletters/RecommendationSection";
import { newsletters } from "../data/newsletters";
import { Newsletter } from "../data/newsletters";
import { useAuth } from "../context/AuthContext";
import { TestRssFetching } from "../components/TestRssFetching";

function Explore() {
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [filteredNewsletters, setFilteredNewsletters] =
    useState<Newsletter[]>(newsletters);
  const pageRef = useRef<HTMLDivElement>(null);

  // Animation effect on mount
  useEffect(() => {
    if (pageRef.current) {
      gsap.fromTo(
        pageRef.current.querySelector("h1"),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
      );

      gsap.fromTo(
        pageRef.current.querySelector(".search-bar"),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, delay: 0.1, ease: "power2.out" }
      );

      gsap.fromTo(
        pageRef.current.querySelectorAll(".newsletter-card"),
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.05,
          delay: 0.2,
          ease: "power2.out",
        }
      );
    }
  }, []);

  // Filter newsletters based on search query and category
  useEffect(() => {
    let results = newsletters;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (newsletter) =>
          newsletter.title.toLowerCase().includes(query) ||
          newsletter.description.toLowerCase().includes(query) ||
          newsletter.author.toLowerCase().includes(query)
      );
    }

    if (selectedCategory) {
      results = results.filter(
        (newsletter) => newsletter.category === selectedCategory
      );
    }

    setFilteredNewsletters(results);
  }, [searchQuery, selectedCategory]);

  // Get unique categories from the newsletter data
  const categories = Array.from(
    new Set(newsletters.map((newsletter) => newsletter.category))
  );

  return (
    <div ref={pageRef} className="container-wide py-8 md:py-12">
      {/* Test RSS Fetching */}
      <TestRssFetching />

      {/* Recommendations Section */}
      {isAuthenticated && <RecommendationSection />}

      {/* Main Content */}
      <div className="mt-12">
        <h1 className="text-3xl md:text-4xl font-semibold mb-8">
          Explore Newsletters
        </h1>

        {/* Search and filter */}
        <div className="search-bar flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={20} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search newsletters by name, author, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div className="relative w-full md:w-48">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter size={20} className="text-gray-400" />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 appearance-none"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Newsletter grid */}
        {filteredNewsletters.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredNewsletters.map((newsletter) => (
              <div key={newsletter.id} className="newsletter-card h-full">
                <NewsletterCard newsletter={newsletter} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No newsletters found matching your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Explore;
