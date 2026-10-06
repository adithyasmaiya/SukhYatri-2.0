import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Compass,
  CalendarCheck2,
  CreditCard,
  Users,
  MessageSquare,
  TicketPercent,
  BarChart3,
  Settings,
  LogOut,
  X,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
  const { currentUser, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast('Signed out from Admin Operations Console', 'info');
      navigate('/login');
    } catch {
      toast('Error signing out', 'error');
    }
  };

  interface NavItem {
    label: string;
    path: string;
    icon: any;
    end?: boolean;
  }

  const navSections: { title: string; items: NavItem[] }[] = [
    {
      title: 'Overview',
      items: [
        { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, end: true },
      ],
    },
    {
      title: 'Travel',
      items: [
        { label: 'Packages', path: '/admin/packages', icon: Package },
        { label: 'Destinations', path: '/admin/destinations', icon: Compass },
      ],
    },
    {
      title: 'Operations',
      items: [
        { label: 'Bookings', path: '/admin/bookings', icon: CalendarCheck2 },
        { label: 'Payments', path: '/admin/payments', icon: CreditCard },
        { label: 'Users', path: '/admin/users', icon: Users },
        { label: 'Reviews', path: '/admin/reviews', icon: MessageSquare },
        { label: 'Coupons', path: '/admin/coupons', icon: TicketPercent },
      ],
    },
    {
      title: 'Analytics',
      items: [
        { label: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
      ],
    },
    {
      title: 'System',
      items: [
        { label: 'Settings', path: '/admin/settings', icon: Settings },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-ink/70 z-40 lg:hidden backdrop-blur-xs"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'w-[260px] shrink-0 bg-[#0B1A17] text-white min-h-screen p-5 flex flex-col fixed inset-y-0 left-0 z-50 lg:static transition-transform duration-300 overflow-y-auto border-r border-white/5 scrollbar-thin',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-2 mb-6">
          <Link to="/admin" className="flex items-center gap-3 group" onClick={onClose}>
            <div className="w-9 h-9 rounded-xl bg-sand flex items-center justify-center font-display font-bold text-ink text-lg shadow-sm group-hover:scale-105 transition">
              S
            </div>
            <div>
              <div className="font-bold text-sm tracking-wide text-white leading-tight">SukhYatri</div>
              <div className="text-[10px] tracking-[0.2em] text-sand font-bold uppercase mt-0.5 flex items-center gap-1">
                <span>Ops Console</span>
                <ShieldCheck className="w-2.5 h-2.5 text-sand inline" />
              </div>
            </div>
          </Link>
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10"
              aria-label="Close navigation"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Sections */}
        <div className="space-y-6 flex-1">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-1">
              <div className="px-3 text-[10px] font-bold tracking-wider text-[#7A928B] uppercase">
                {section.title}
              </div>
              <div className="space-y-0.5 mt-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.end}
                      onClick={onClose}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-all duration-150',
                          isActive
                            ? 'bg-moss text-white font-semibold shadow-sm'
                            : 'text-[#9AB0AA] hover:bg-white/5 hover:text-white'
                        )
                      }
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="flex-1">{item.label}</span>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Link to customer-facing website */}
        <div className="pt-4 border-t border-white/10 mt-4 mb-3">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-[#C4D5D0] flex items-center justify-between transition"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-sand" />
              <span>Customer Website</span>
            </span>
            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white/70">Live</span>
          </Link>
        </div>

        {/* Bottom Profile & Logout */}
        <div className="bg-white/5 rounded-2xl p-3 border border-white/10 flex items-center justify-between">
          <Link
            to={`/admin/users/${currentUser?.id || (currentUser as any)?._id || ''}`}
            onClick={onClose}
            className="flex items-center gap-2.5 min-w-0 flex-1 hover:opacity-85 transition"
          >
            <div className="w-8 h-8 rounded-full bg-sand text-ink flex items-center justify-center font-bold text-xs shrink-0">
              {currentUser?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-white truncate leading-tight">
                {currentUser?.name || 'Admin'}
              </div>
              <div className="text-[10px] text-white/50 truncate">
                {currentUser?.email || 'admin@sukhyatri.com'}
              </div>
            </div>
          </Link>
          <button
            onClick={handleLogout}
            title="Log Out"
            className="w-8 h-8 rounded-lg text-white/60 hover:text-clay hover:bg-white/10 flex items-center justify-center transition shrink-0 ml-1"
            aria-label="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>
    </>
  );
};
