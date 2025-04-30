import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import gsap from 'gsap';
import ReactMarkdown from 'https://esm.sh/react-markdown@9.0.1';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getIssueById, getIssuesByNewsletterId, Issue } from '../data/issues';
import { newsletters, Newsletter } from '../data/newsletters';

function ReaderPage() {
  const { newsletterId, issueId } = useParams<{ newsletterId: string; issueId: string }>();
  const [issue, setIssue] = useState<Issue | undefined>();
  const [newsletter, setNewsletter] = useState<Newsletter | undefined>();
  const [allIssues, setAllIssues] = useState<Issue[]>([]);
  const [currentIssueIndex, setCurrentIssueIndex] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (newsletterId && issueId) {
      // Get current issue
      const currentIssue = getIssueById(issueId);
      setIssue(currentIssue);
      
      // Get newsletter
      const foundNewsletter = newsletters.find(n => n.id === newsletterId);
      setNewsletter(foundNewsletter);
      
      // Get all issues from this newsletter to support navigation
      const issues = getIssuesByNewsletterId(newsletterId);
      setAllIssues(issues);
      
      // Find current issue index
      const index = issues.findIndex(i => i.id === issueId);
      if (index !== -1) {
        setCurrentIssueIndex(index);
      }
      
      // Scroll to top when issue changes
      window.scrollTo(0, 0);
      
      // Animation
      if (contentRef.current) {
        gsap.fromTo(
          contentRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.8, ease: 'power2.inOut' }
        );
      }
    }
  }, [newsletterId, issueId]);

  const navigateToIssue = (index: number) => {
    if (index >= 0 && index < allIssues.length && newsletterId) {
      const targetIssue = allIssues[index];
      window.location.href = `/read/${newsletterId}/${targetIssue.id}`;
    }
  };

  if (!issue || !newsletter) {
    return (
      <div className="reader-container py-12 text-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div ref={contentRef} className="reader-container">
      {/* Title section */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-semibold mb-4">{issue.title}</h1>
        <p className="text-gray-500 text-sm">
          {new Date(issue.date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>
      
      {/* Content */}
      <div className="reader-content prose mx-auto">
        <ReactMarkdown>{issue.content.toString()}</ReactMarkdown>
      </div>
      
      {/* Navigation */}
      <div className="mt-12 pt-8 border-t border-gray-200 flex justify-between">
        <button
          onClick={() => navigateToIssue(currentIssueIndex - 1)}
          disabled={currentIssueIndex <= 0}
          className={`flex items-center px-4 py-2 rounded-md ${
            currentIssueIndex <= 0
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <ChevronLeft size={20} className="mr-1" />
          Older
        </button>
        
        <button
          onClick={() => navigateToIssue(currentIssueIndex + 1)}
          disabled={currentIssueIndex >= allIssues.length - 1}
          className={`flex items-center px-4 py-2 rounded-md ${
            currentIssueIndex >= allIssues.length - 1
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          Newer
          <ChevronRight size={20} className="ml-1" />
        </button>
      </div>
    </div>
  );
}

export default ReaderPage;