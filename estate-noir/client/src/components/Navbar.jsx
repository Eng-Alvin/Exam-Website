import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); setDropdownOpen(false); }, [location]);

  useEffect(() => {
    const handleOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); };
  const initials = user?.username?.slice(0, 2).toUpperCase() || 'EN';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-300 ${scrolled ? 'border-b border-line shadow-sm' : 'border-b border-line-soft'}`}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-8 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group shrink-0">
          <svg width="16" height="16" viewBox="0 0 14 14" fill="none" className="text-gold">
            <path d="M7 0L9.33 4.67L14 7L9.33 9.33L7 14L4.67 9.33L0 7L4.67 4.67L7 0Z" fill="currentColor" />
          </svg>
          <span className="font-display text-base font-semibold tracking-tight text-ink">
            My<span className="text-gold">Home</span>
          </span>
        </Link>

        {/* Desktop center links */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-medium text-ink-soft hover:text-ink transition-colors duration-200">
            Properties
          </Link>
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-5">
          {user ? (
            <>
              <Link to="/dashboard" className="text-sm font-medium text-ink-soft hover:text-gold transition-colors duration-200">
                My Listings
              </Link>
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((p) => !p)}
                  className="flex items-center gap-2 border border-line rounded-full pl-3 pr-1.5 py-1.5 hover:shadow-card transition-shadow cursor-pointer"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-ink-soft">
                    <path d="M3 12h18M3 6h18M3 18h18" />
                  </svg>
                  <span className="w-7 h-7 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center text-gold text-xs font-semibold">
                    {initials}
                  </span>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 top-14 w-64 bg-white border border-line rounded-2xl shadow-card-hover overflow-hidden">
                    {/* User info header */}
                    <div className="px-5 py-4 border-b border-line-soft flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center text-gold text-sm font-semibold shrink-0">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-ink font-medium truncate">@{user.username}</p>
                        <p className="text-xs text-ink-faint truncate mt-0.5">{user.email}</p>
                      </div>
                    </div>
                    {/* Navigation links */}
                    <div className="py-2">
                      <Link
                        to="/account"
                        className="flex items-center gap-3 px-5 py-2.5 text-sm text-ink-soft hover:text-ink hover:bg-surface-alt transition-colors"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                        </svg>
                        Account Settings
                      </Link>
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-3 px-5 py-2.5 text-sm text-ink-soft hover:text-ink hover:bg-surface-alt transition-colors"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="3" width="20" height="14" rx="1" /><path d="M8 21h8M12 17v4" />
                        </svg>
                        My Listings
                      </Link>
                    </div>
                    <div className="border-t border-line-soft py-2">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-3 px-5 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
                        </svg>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="text-sm font-medium text-ink-soft hover:text-ink px-4 py-2 rounded-full hover:bg-surface-alt transition-colors duration-200">
                Sign In
              </Link>
              <Link to="/register" className="text-sm font-semibold bg-gold text-white px-5 py-2.5 rounded-xl hover:bg-gold-light transition-colors duration-200 shadow-sm">
                Join
              </Link>
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden flex flex-col gap-[5px] cursor-pointer p-1" onClick={() => setMenuOpen((p) => !p)} aria-label="Menu">
          <span className={`block w-5 h-0.5 bg-ink rounded-full transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
          <span className={`block w-5 h-0.5 bg-ink rounded-full transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-ink rounded-full transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
        </button>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-line px-6 py-6 flex flex-col gap-4 shadow-card">
          <Link to="/" className="text-sm font-medium text-ink-soft hover:text-gold transition-colors">Properties</Link>
          {user ? (
            <>
              <div className="flex items-center gap-3 pb-4 border-b border-line-soft">
                <div className="w-9 h-9 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center text-gold text-sm font-semibold shrink-0">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-ink font-medium">@{user.username}</p>
                  <p className="text-xs text-ink-faint truncate">{user.email}</p>
                </div>
              </div>
              <Link to="/dashboard" className="text-sm font-medium text-ink-soft hover:text-gold transition-colors">My Listings</Link>
              <Link to="/account" className="text-sm font-medium text-ink-soft hover:text-gold transition-colors">Account Settings</Link>
              <button onClick={handleLogout} className="text-left text-sm font-medium text-red-500 hover:text-red-600 cursor-pointer transition-colors">Sign Out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-ink-soft hover:text-gold transition-colors">Sign In</Link>
              <Link to="/register" className="text-sm font-semibold text-gold">Join the Circle</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
