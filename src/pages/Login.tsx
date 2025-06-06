import { useEffect, useRef } from "react";
import { Link, Navigate } from "react-router-dom";
import gsap from "gsap";
import { Inbox } from "lucide-react";
import LoginForm from "../components/auth/LoginForm";
import { useAuth } from "../context/AuthContext";

function Login() {
  const { isAuthenticated } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current.querySelector(".auth-card"),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );
    }
  }, []);

  if (isAuthenticated) {
    return <Navigate to="/explore" replace />;
  }

  return (
    <div ref={containerRef} className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="auth-card bg-white rounded-lg shadow-md p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <Link
              to="/"
              className="inline-flex items-center text-2xl font-semibold text-primary-600"
            >
              <Inbox className="mr-2" />
              <span>Papertrail</span>
            </Link>
            <h1 className="mt-6 text-2xl font-bold text-gray-900">
              Welcome back
            </h1>
            <p className="mt-2 text-gray-600">Sign in to your account</p>
          </div>

          <LoginForm />
        </div>
      </div>

      <footer className="p-4 text-center text-gray-500 text-sm">
        <p>© 2023 Papertrail. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Login;
