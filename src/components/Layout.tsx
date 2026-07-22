import { useState } from "react"
import { Outlet, Link, useLocation } from "react-router-dom"
import { Menu, BookOpen, User } from "lucide-react"
import Logo from "./Logo"
import ThemeToggle from "./ThemeToggle"

const ADMIN_PATH = import.meta.env.VITE_ADMIN_PATH || "admin-fallback-123"

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const semesters = [3, 4, 5, 6, 7, 8]

  const SidebarContent = () => (
    <div className="h-full flex flex-col bg-accent w-72 overflow-y-auto hide-scrollbar">
      <div className="p-6">
        <Link to="/" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 group">
          <div className="bg-inverse text-body p-3 rounded-[20px] group-hover:scale-105 transition-all shadow-md">
            <Logo className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-text-main leading-none tracking-tight">
              Notes Vault
            </h1>
            <p className="text-[10px] text-text-muted mt-1 font-bold uppercase tracking-wider">AI-DS Dept • BMSCE</p>
          </div>
        </Link>
      </div>

      <div className="px-4 py-2">
        <h2 className="px-2 text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Semesters</h2>
        <div className="space-y-1">
          {semesters.map(sem => {
            const isActive = location.pathname === `/semester/${sem}`
            return (
              <Link
                key={sem}
                to={`/semester/${sem}`}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center px-4 py-3 rounded-full text-[14px] font-bold transition-all duration-300 group ${
                  isActive 
                    ? "bg-inverse text-body shadow-md" 
                    : "text-text-muted hover:bg-inverse/10 hover:text-text-main"
                }`}
              >
                <BookOpen className={`w-5 h-5 mr-3 ${isActive ? "text-body" : "text-text-muted group-hover:text-text-main"} transition-colors`} />
                Semester {sem}
              </Link>
            )
          })}
        </div>
      </div>

      <div className="mt-auto p-4">
        <div className="space-y-1 mb-4 pb-4 border-b border-border-color">
          <div className="flex items-center justify-between px-3 py-2.5 rounded-lg">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-0.5">For any queries, contact</span>
              <span className="text-[13px] font-semibold text-text-main">Vedant Vishambhari</span>
            </div>
            <a
              href="https://www.linkedin.com/in/vedant-vishambhari-448ab3411/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-8 h-8 text-[#0A66C2] bg-[#0A66C2]/10 hover:bg-[#0A66C2] hover:text-white rounded-lg transition-all duration-300"
              title="Connect on LinkedIn"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>
        <div className="flex items-center justify-between space-y-1">
          <Link 
            to={`/${ADMIN_PATH}`} 
            onClick={() => setSidebarOpen(false)}
            className="flex-1 flex items-center px-4 py-3 rounded-full text-[14px] font-bold text-text-muted hover:bg-inverse/10 hover:text-text-main transition-colors group"
          >
            <User className="w-5 h-5 mr-3 text-text-muted group-hover:text-text-main transition-colors" />
            Admin Access
          </Link>
          <div className="px-2">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-body flex font-sans transition-colors duration-300">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-text-main/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto lg:h-screen ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-30 bg-card/80 backdrop-blur-md border-b border-border-color px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Logo className="w-7 h-7 text-inverse" />
            <span className="font-extrabold text-text-main text-lg tracking-tight">Notes Vault</span>
          </Link>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-2 -mr-2 text-text-main hover:bg-inverse/10 rounded-xl transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-12 animate-fade-in">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  )
}
