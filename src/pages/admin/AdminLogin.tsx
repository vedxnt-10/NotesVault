import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

const ADMIN_PATH = import.meta.env.VITE_ADMIN_PATH || "admin-fallback-123";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let meta = document.querySelector('meta[name="robots"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'robots');
      meta.setAttribute('content', 'noindex');
      document.head.appendChild(meta);
    }

    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate(`/${ADMIN_PATH}/dashboard`);
      }
    };
    checkAuth();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        throw signInError;
      }

      if (data.session) {
        navigate(`/${ADMIN_PATH}/dashboard`);
      }
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 relative">
      <div className="bg-card/80 backdrop-blur-xl p-10 rounded-3xl border border-border-color shadow-soft">
        <div className="text-center mb-8">
          <div className="bg-accent w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-sm">
            <svg className="w-8 h-8 text-inverse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-extrabold text-text-main tracking-tight">Admin Access</h2>
          <p className="text-sm font-medium text-text-muted mt-2">Enter your admin credentials to manage content.</p>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-semibold mb-6 border border-red-100 flex items-center gap-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="peer w-full px-4 pt-6 pb-2 bg-body border border-border-color rounded-xl focus:outline-none focus:border-inverse focus:bg-card focus:ring-4 focus:ring-inverse/10 transition-all font-medium placeholder-transparent text-text-main"
              placeholder="Email"
              required
            />
            <label 
              htmlFor="email" 
              className="absolute left-4 top-2 text-xs font-bold text-text-muted transition-all peer-placeholder-shown:text-base peer-placeholder-shown:font-medium peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-xs peer-focus:font-bold peer-focus:text-inverse cursor-text"
            >
              Email Address
            </label>
          </div>
          
          <div className="relative">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="peer w-full px-4 pt-6 pb-2 bg-body border border-border-color rounded-xl focus:outline-none focus:border-inverse focus:bg-card focus:ring-4 focus:ring-inverse/10 transition-all font-medium placeholder-transparent text-text-main"
              placeholder="Password"
              required
            />
            <label 
              htmlFor="password" 
              className="absolute left-4 top-2 text-xs font-bold text-text-muted transition-all peer-placeholder-shown:text-base peer-placeholder-shown:font-medium peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-xs peer-focus:font-bold peer-focus:text-inverse cursor-text"
            >
              Password
            </label>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-inverse text-body font-bold py-3.5 rounded-xl hover:bg-inverse/80 hover:shadow-md hover:-translate-y-0.5 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
              </>
            ) : "Secure Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
