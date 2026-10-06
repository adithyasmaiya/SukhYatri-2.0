import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, ChevronDown, Menu, X, Shield, Heart, Compass, User as UserIcon, Settings, LogOut } from 'lucide-react';
import { DESTINATIONS } from '../../data/destinations';
import { formatINR } from '../../utils/format';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { Button } from '../ui/Button';

export interface NavbarProps {
  onOpenMobileMenu?: () => void;
  isMobileMenuOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenMobileMenu, isMobileMenuOpen }) => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { count: wishlistCount } = useWishlist();
  const [destDropdownOpen, setDestDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-[100] bg-cream/90 backdrop-blur-xl border-b border-stonewarm">
      <div className="max-w-[1280px] mx-auto px-5 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo & Brand Treatment */}
          <Link to="/" className="flex items-center gap-3 select-none group">
            <div className="w-10 h-10 rounded-2xl bg-pine flex items-center justify-center relative overflow-hidden transition-transform group-hover:scale-105 shadow-sm">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2C8 6 5 9.5 5 13.5A7 7 0 0 0 12 20.5A7 7 0 0 0 19 13.5C19 9.5 16 6 12 2Z"
                  fill="#C8A96A"
                />
                <circle cx="12" cy="13.5" r="2.6" fill="#0E3B34" />
                <path
                  d="M8.5 17.5c1-1 2.2-1.5 3.5-1.5s2.5.5 3.5 1.5"
                  stroke="#FAF7F1"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-moss/40 rounded-full blur-sm" />
            </div>
            <div className="leading-none">
              <div className="font-display font-bold text-[22px] tracking-tight text-ink">
                Sukh<span className="text-moss">Yatri</span>
              </div>
              <div className="text-[9.5px] font-bold tracking-[0.22em] uppercase text-muted mt-0.5">
                Comfort · Joy · Yatra
              </div>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-sm font-bold transition-colors relative py-1 ${
                  isActive ? 'text-pine' : 'text-[#3A4542] hover:text-pine'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  Home
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sand rounded-full" />
                  )}
                </>
              )}
            </NavLink>

            <NavLink
              to="/explore"
              className={({ isActive }) =>
                `text-sm font-bold transition-colors relative py-1 ${
                  isActive ? 'text-pine' : 'text-[#3A4542] hover:text-pine'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  Explore Trips
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sand rounded-full" />
                  )}
                </>
              )}
            </NavLink>

            {/* Destinations Dropdown */}
            <div
              className="relative group py-2"
              onMouseEnter={() => setDestDropdownOpen(true)}
              onMouseLeave={() => setDestDropdownOpen(false)}
            >
              <button
                onClick={() => navigate('/destinations')}
                className="flex items-center gap-1 text-sm font-bold text-[#3A4542] hover:text-pine transition-colors cursor-pointer"
              >
                <span>Destinations</span>
                <ChevronDown className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-200" />
              </button>

              {/* Megamenu */}
              <div
                className={`absolute top-full left-1/2 -translate-x-1/2 pt-2 transition-all duration-300 ${
                  destDropdownOpen
                    ? 'opacity-100 visible translate-y-0'
                    : 'opacity-0 invisible translate-y-2'
                }`}
              >
                <div className="bg-white rounded-3xl shadow-lift border border-stonewarm p-4 w-[540px] grid grid-cols-2 gap-2.5">
                  {DESTINATIONS.map((d) => (
                    <Link
                      key={d.id}
                      to={`/destination/${d.slug}`}
                      onClick={() => setDestDropdownOpen(false)}
                      className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-cream transition group/item"
                    >
                      <img
                        src={d.image}
                        alt={d.name}
                        className="w-13 h-13 w-12 h-12 rounded-xl object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-ink group-hover/item:text-pine transition truncate">
                          {d.name}
                        </div>
                        <div className="text-xs text-muted font-medium">
                          from {formatINR(d.priceFrom)} · ★ {d.rating}
                        </div>
                      </div>
                    </Link>
                  ))}
                  <div className="col-span-2 pt-2 border-t border-stonewarm flex justify-between items-center px-2">
                    <span className="text-xs text-muted font-medium">
                      All 8 curated circuits available for 2026/27
                    </span>
                    <Link
                      to="/destinations"
                      onClick={() => setDestDropdownOpen(false)}
                      className="text-xs font-bold text-moss hover:underline"
                    >
                      View all destinations →
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                `text-sm font-bold transition-colors relative py-1 ${
                  isActive ? 'text-pine' : 'text-[#3A4542] hover:text-pine'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  About
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sand rounded-full" />
                  )}
                </>
              )}
            </NavLink>

            <NavLink
              to="/my-trips"
              className={({ isActive }) =>
                `text-sm font-bold transition-colors relative py-1 ${
                  isActive ? 'text-pine' : 'text-[#3A4542] hover:text-pine'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  My Trips
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sand rounded-full" />
                  )}
                </>
              )}
            </NavLink>

            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `text-sm font-bold transition-colors relative py-1 ${
                  isActive ? 'text-pine' : 'text-[#3A4542] hover:text-pine'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  Contact
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sand rounded-full" />
                  )}
                </>
              )}
            </NavLink>
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Quick Search */}
            <button
              onClick={() => navigate('/explore')}
              className="text-sm font-bold text-pine flex items-center gap-2 hover:gap-2.5 transition-all p-2 rounded-full hover:bg-cream2"
              title="Search journeys"
            >
              <Search className="w-4 h-4 text-pine" />
              <span>Search</span>
            </button>

            {/* Wishlist Link */}
            <Link
              to="/my-trips"
              className="relative p-2 text-ink hover:text-clay transition rounded-full hover:bg-cream2"
              title="Saved Trips"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-clay text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Admin Switcher */}
            <Link
              to="/admin"
              className="text-xs font-bold text-muted border border-stonewarm rounded-full px-3 py-1.5 hover:border-pine hover:text-pine transition flex items-center gap-1.5"
            >
              <Shield className="w-3 h-3 text-muted" />
              Admin
            </Link>

            {/* User Auth Info */}
            {currentUser ? (
              <div
                className="relative"
                onMouseEnter={() => setUserDropdownOpen(true)}
                onMouseLeave={() => setUserDropdownOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 bg-white border border-stonewarm rounded-full pl-1.5 pr-3 py-1 hover:border-pine transition cursor-pointer shadow-2xs select-none"
                  aria-expanded={userDropdownOpen}
                >
                  {currentUser.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-7 h-7 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-pine text-white flex items-center justify-center text-xs font-bold shrink-0">
                      {currentUser.name.charAt(0)}
                    </div>
                  )}
                  <span className="text-xs font-bold text-ink truncate max-w-[100px]">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-muted transition-transform duration-200 ${
                      userDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* User Profile Menu Dropdown */}
                <div
                  className={`absolute right-0 top-full pt-2 w-56 transition-all duration-200 z-50 ${
                    userDropdownOpen
                      ? 'opacity-100 visible translate-y-0'
                      : 'opacity-0 invisible translate-y-2'
                  }`}
                >
                  <div className="bg-white rounded-2xl shadow-lift border border-stonewarm p-2 text-xs space-y-1">
                    {/* User Header */}
                    <div className="px-3 py-2 border-b border-stonewarm/60">
                      <div className="font-bold text-ink truncate">{currentUser.name}</div>
                      <div className="text-[11px] text-muted truncate">{currentUser.email}</div>
                    </div>

                    <Link
                      to="/my-trips"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-ink font-bold hover:bg-cream hover:text-pine transition"
                    >
                      <Compass className="w-4 h-4 text-pine" />
                      <span>My Trips</span>
                    </Link>

                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-ink font-bold hover:bg-cream hover:text-pine transition"
                    >
                      <UserIcon className="w-4 h-4 text-pine" />
                      <span>Profile</span>
                    </Link>

                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-ink font-bold hover:bg-cream hover:text-pine transition"
                    >
                      <Settings className="w-4 h-4 text-pine" />
                      <span>Settings</span>
                    </Link>

                    <div className="pt-1 border-t border-stonewarm/60">
                      <button
                        type="button"
                        onClick={async () => {
                          setUserDropdownOpen(false);
                          await logout();
                          navigate('/');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-clay font-bold hover:bg-red-50 transition cursor-pointer text-left"
                      >
                        <LogOut className="w-4 h-4 text-clay" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-bold text-pine hover:text-moss transition"
                >
                  Login
                </Link>
                <Button size="sm" variant="primary" onClick={() => navigate('/signup')}>
                  Sign Up
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Right Controls */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => navigate('/explore')}
              className="w-10 h-10 rounded-full bg-white border border-stonewarm flex items-center justify-center text-ink shadow-sm"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenMobileMenu}
              className="w-10 h-10 rounded-full bg-pine text-white flex items-center justify-center shadow-sm"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
