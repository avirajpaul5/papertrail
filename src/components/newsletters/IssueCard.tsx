import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";
import gsap from "gsap";
import { Issue } from "../../data/issues";

interface IssueCardProps {
  issue: Issue;
  index: number;
}

function IssueCard({ issue, index }: IssueCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Staggered animation on first render
  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          delay: index * 0.1,
          ease: "power2.out",
        }
      );
    }
  }, [index]);

  return (
    <div
      ref={cardRef}
      className="card bg-white rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200"
    >
      <Link
        to={`/read/${issue.newsletter_id}/${issue.id}`}
        className="block p-4"
      >
        <h3 className="font-medium text-gray-900 text-lg mb-2">
          {issue.title}
        </h3>

        <div className="flex items-center text-xs text-gray-500 mb-3">
          <Calendar size={14} className="mr-1" />
          <span>
            {new Date(issue.published_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>

        <p className="text-gray-600 text-sm line-clamp-3">{issue.snippet}</p>

        <div className="mt-3 text-primary-600 text-sm font-medium">
          Read issue →
        </div>
      </Link>
    </div>
  );
}

export default IssueCard;
