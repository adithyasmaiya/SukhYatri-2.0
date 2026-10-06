import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DESTINATIONS } from '../../data/destinations';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  if (!isOpen) return null;

  const handleNav = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="lg:hidden border-b border-stonewarm bg-cream px-5 py-6 space-y-2 max-h-[85vh] overflow-y-auto animate-toast-in">
      <button
        onClick={() => handleNav('/')}
        className="w-full text-left font-bold text-base py-3 border-b border-stonewarm text-ink"
      >
        Home
      </button>

      <button
        onClick={() => handleNav('/explore')}
        className="w-full text-left font-bold text-base py-3 border-b border-stonewarm text-ink"
      >
        Explore Trips
      </button>

      <button
        onClick={() => handleNav('/destinations')}
        className="w-full text-left font-bold text-base py-3 border-b border-stonewarm text-ink"
      >
        Destinations
      </button>

      {/* Destination Chips */}
      <div className="py-3 border-b border-stonewarm">
        <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted mb-2.5">
          Curated Regions
        </div>
        <div className="flex flex-wrap gap-2">
          {DESTINATIONS.map((d) => (
            <button
              key={d.id}
              onClick={() => handleNav(`/destination/${d.slug}`)}
              className="text-xs font-semibold bg-white border border-stonewarm rounded-full px-3 py-1.5 hover:border-pine hover:text-pine transition"
            >
              {d.name}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => handleNav('/about')}
        className="w-full text-left font-bold text-base py-3 border-b border-stonewarm text-ink"
      >
        About
      </button>

      <button
        onClick={() => handleNav('/my-trips')}
        className="w-full text-left font-bold text-base py-3 border-b border-stonewarm text-ink"
      >
        My Trips
      </button>

      <button
        onClick={() => handleNav('/contact')}
        className="w-full text-left font-bold text-base py-3 border-b border-stonewarm text-ink"
      >
        Contact
      </button>

      {/* Auth & Admin Buttons */}
      <div className="pt-4 flex flex-col gap-3">
        {currentUser ? (
          <div className="bg-white border border-stonewarm p-4 rounded-2xl space-y-3">
            <div className="flex items-center gap-2.5 pb-2 border-b border-stonewarm/60">
              <div className="w-9 h-9 rounded-full bg-pine text-white flex items-center justify-center text-xs font-bold shrink-0">
                {currentUser.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-ink truncate">{currentUser.name}</div>
                <div className="text-[11px] text-muted truncate">{currentUser.email}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <button
                type="button"
                onClick={() => handleNav('/profile')}
                className="py-2 px-3 rounded-xl bg-cream2 text-ink hover:text-pine text-center"
              >
                Profile
              </button>
              <button
                type="button"
                onClick={() => handleNav('/profile')}
                className="py-2 px-3 rounded-xl bg-cream2 text-ink hover:text-pine text-center"
              >
                Settings
              </button>
            </div>

            <button
              type="button"
              onClick={async () => {
                await logout();
                onClose();
                navigate('/');
              }}
              className="w-full py-2 text-xs font-bold text-clay hover:bg-red-50 rounded-xl transition text-center"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" onClick={() => handleNav('/login')}>
              Login
            </Button>
            <Button variant="primary" size="sm" onClick={() => handleNav('/signup')}>
              Sign Up
            </Button>
          </div>
        )}

        <Link
          to="/admin"
          onClick={onClose}
          className="w-full py-2.5 text-center text-xs font-bold text-muted border border-stonewarm rounded-full hover:border-pine hover:text-pine"
        >
          Access Admin Dashboard ↗
        </Link>
      </div>
    </div>
  );
};
