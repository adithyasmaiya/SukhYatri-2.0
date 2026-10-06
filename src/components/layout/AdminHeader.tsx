import React, { useState, useRef, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Menu, Bell, ChevronRight, User, Settings, LogOut, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export interface AdminHeaderProps {
  onToggleSidebar?: () => void;
  title?: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onToggleSidebar, title }) => {
  const { currentUser, logout } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast('Signed out successfully', 'info');
      navigate('/login');
    } catch {
      toast('Error signing out', 'error');
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchVal.trim()) return;
    // Default search routing based on current path or navigate to bookings with search
    if (location.pathname.includes('/packages')) {
      navigate(`/admin/packages?search=${encodeURIComponent(searchVal.trim())}`);
    } else if (location.pathname.includes('/users')) {
      navigate(`/admin/users?search=${encodeURIComponent(searchVal.trim())}`);
    } else {
      navigate(`/admin/bookings?search=${encodeURIComponent(searchVal.trim())}`);
    }
  };

  // Generate breadcrumbs from pathname
  const pathParts = location.pathname.split('/').filter(Boolean);
  const breadcrumbs = pathParts.map((part, idx) => {
    const path = '/' + pathParts.slice(0, idx + 1).join('/');
    const label = part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' ');
    return { label, path, isLast: idx === pathParts.length - 1 };
  });

  const getPageTitle = () => {
    if (title) return title;
    const current = pathParts[pathParts.length - 1];
    if (!current || current === 'admin') return 'Operations Overview';
    if (current === 'new') return `Create New ${pathParts[pathParts.length - 2]?.slice(0, -1) || 'Item'}`;
    if (current === 'edit') return `Edit ${pathParts[pathParts.length - 3]?.slice(0, -1) || 'Item'}`;
    return current.charAt(0).toUpperCase() + current.slice(1).replace(/-/g, ' ');
  };

  return (
    <header className="bg-white border-b border-[#DFE5E2] px-4 lg:px-8 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden w-9 h-9 rounded-xl bg-ink text-white flex items-center justify-center hover:bg-ink/90 transition shrink-0"
          aria-label="Toggle navigation"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="min-w-0">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-[11px] text-muted mb-0.5 overflow-hidden text-ellipsis whitespace-nowrap">
            <Link to="/admin" className="hover:text-ink transition font-medium">
              Admin
            </Link>
            {breadcrumbs.slice(1).map((bc) => (
              <React.Fragment key={bc.path}>
                <ChevronRight className="w-3 h-3 text-muted/60 shrink-0" />
                {bc.isLast ? (
                  <span className="font-semibold text-ink truncate">{bc.label}</span>
                ) : (
                  <Link to={bc.path} className="hover:text-ink transition truncate">
                    {bc.label}
                  </Link>
                )}
              </React.Fragment>
            ))}
          </nav>
          {/* Page Title */}
          <h1 className="font-display font-bold text-ink text-base lg:text-lg leading-tight truncate">
            {getPageTitle()}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center gap-2 bg-[#F2F4F3] rounded-xl px-3 py-2 border border-transparent focus-within:border-moss/40 focus-within:bg-white transition">
          <Search className="w-3.5 h-3.5 text-muted" />
          <input
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Search bookings, guests, trips…"
            className="bg-transparent text-xs font-medium outline-none w-36 lg:w-56 text-ink placeholder:text-muted"
          />
        </form>

        {/* Notifications Icon */}
        <button
          onClick={() => toast('All system operations running normally. No alerts detected.', 'info')}
          className="w-9 h-9 rounded-xl bg-[#F2F4F3] text-ink flex items-center justify-center relative hover:bg-stonewarm/60 transition"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-moss rounded-full ring-2 ring-white" />
        </button>

        {/* Profile Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-xl hover:bg-[#F2F4F3] transition"
            aria-label="Admin Profile Menu"
          >
            <div className="w-8 h-8 rounded-full bg-pine text-white flex items-center justify-center font-bold text-xs shadow-sm">
              {currentUser?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <span className="hidden sm:inline text-xs font-semibold text-ink">
              {currentUser?.name?.split(' ')[0] || 'Admin'}
            </span>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-lift border border-[#E5EAE8] py-2 z-50 animate-toast-in">
              <div className="px-4 py-2 border-b border-[#F0F4F2]">
                <div className="text-xs font-bold text-ink truncate">{currentUser?.name || 'Admin'}</div>
                <div className="text-[10px] text-muted truncate">{currentUser?.email}</div>
                <span className="inline-block mt-1 text-[9px] bg-moss/10 text-moss font-bold px-2 py-0.5 rounded-full uppercase">
                  Administrator
                </span>
              </div>

              <div className="py-1">
                <Link
                  to="/profile"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-ink hover:bg-[#F7F9F8] transition"
                >
                  <User className="w-3.5 h-3.5 text-muted" />
                  <span>Profile</span>
                </Link>
                <Link
                  to="/admin/settings"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-ink hover:bg-[#F7F9F8] transition"
                >
                  <Settings className="w-3.5 h-3.5 text-muted" />
                  <span>Settings</span>
                </Link>
              </div>

              <div className="border-t border-[#F0F4F2] pt-1">
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-clay hover:bg-clay/5 transition text-left"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
