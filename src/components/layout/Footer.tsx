import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Linkedin,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Send,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export const Footer: React.FC = () => {
  const { toast } = useToast();
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      toast('Please enter a valid email address to receive your voucher', 'error');
      return;
    }
    toast(
      `Welcome aboard! ₹1,500 festive discount voucher sent to <b>${newsletterEmail}</b>`,
      'success'
    );
    setNewsletterEmail('');
  };

  return (
    <footer className="bg-pinedark text-white relative overflow-hidden border-t border-white/10">
      {/* Background radial glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-moss/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-5 lg:px-8 pt-16 pb-12 relative">
        {/* Main Grid: 5 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Column 1: Brand & Credentials */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3 select-none">
              <div className="w-10 h-10 rounded-2xl bg-sand flex items-center justify-center shadow-sm">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2C8 6 5 9.5 5 13.5A7 7 0 0 0 12 20.5A7 7 0 0 0 19 13.5C19 9.5 16 6 12 2Z"
                    fill="#0E3B34"
                  />
                  <circle cx="12" cy="13.5" r="2.6" fill="#FAF7F1" />
                </svg>
              </div>
              <div className="leading-none">
                <div className="font-display text-2xl font-bold text-white tracking-tight">
                  Sukh<span className="text-sand">Yatri</span>
                </div>
                <div className="text-[9.5px] font-bold tracking-[0.2em] uppercase text-sandlight mt-0.5">
                  Comfort · Joy · Yatra
                </div>
              </div>
            </Link>

            <p className="text-white/70 text-sm leading-relaxed max-w-sm">
              Travel in Comfort. Arrive in Joy. Curated Indian journeys with handpicked boutique stays,
              rested drivers, and a 24×7 human travel concierge.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              <Badge variant="outline" size="sm">
                <ShieldCheck className="w-3 h-3 mr-1 text-sand" /> IATA Accredited
              </Badge>
              <Badge variant="outline" size="sm">
                ★ 4.9 · 8.2k Reviews
              </Badge>
              <Badge variant="sand" size="sm">
                Govt. of India Approved
              </Badge>
            </div>

            {/* Social Icons */}
            <div className="pt-2">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-sand mb-3">
                Follow Our Road Stories
              </div>
              <div className="flex items-center gap-2.5">
                {[
                  { icon: Instagram, label: 'Instagram', url: 'https://instagram.com' },
                  { icon: Twitter, label: 'Twitter / X', url: 'https://twitter.com' },
                  { icon: Facebook, label: 'Facebook', url: 'https://facebook.com' },
                  { icon: Youtube, label: 'YouTube', url: 'https://youtube.com' },
                  { icon: Linkedin, label: 'LinkedIn', url: 'https://linkedin.com' },
                ].map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <a
                      key={i}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full bg-white/10 hover:bg-sand hover:text-ink text-white/80 flex items-center justify-center transition"
                      aria-label={s.label}
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Column 2: Explore */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-sand mb-4">
              Explore India
            </div>
            <ul className="space-y-2.5 text-xs text-white/70 font-medium">
              <li>
                <Link to="/destination/kerala" className="hover:text-white transition">
                  Kerala Backwaters
                </Link>
              </li>
              <li>
                <Link to="/destination/goa" className="hover:text-white transition">
                  Goa Soul &amp; Sand
                </Link>
              </li>
              <li>
                <Link to="/destination/kashmir" className="hover:text-white transition">
                  Kashmir Alpine Valleys
                </Link>
              </li>
              <li>
                <Link to="/destination/jaipur" className="hover:text-white transition">
                  Jaipur Pink Palaces
                </Link>
              </li>
              <li>
                <Link to="/destination/manali" className="hover:text-white transition">
                  Manali Pine Cottages
                </Link>
              </li>
              <li>
                <Link to="/destination/coorg" className="hover:text-white transition">
                  Coorg Coffee Trails
                </Link>
              </li>
              <li>
                <Link to="/destination/andaman" className="hover:text-white transition">
                  Andaman Barefoot Islands
                </Link>
              </li>
              <li>
                <Link to="/explore" className="text-sand font-bold hover:underline inline-block pt-1">
                  View all 48 journeys →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company & Trust */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-sand mb-4">
              Company
            </div>
            <ul className="space-y-2.5 text-xs text-white/70 font-medium">
              <li>
                <Link to="/about" className="hover:text-white transition">
                  Our Story &amp; Founders
                </Link>
              </li>
              <li>
                <Link to="/destinations" className="hover:text-white transition">
                  Curated Circuits
                </Link>
              </li>
              <li>
                <Link to="/my-trips" className="hover:text-white transition">
                  My Bookings &amp; Saved
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-white transition">
                  Partner / Admin Console
                </Link>
              </li>
              <li>
                <button
                  onClick={() =>
                    toast('Careers portal opening soon — write to careers@sukhyatri.in', 'info')
                  }
                  className="hover:text-white transition text-left"
                >
                  Careers (We are hiring!)
                </button>
              </li>
              <li>
                <button
                  onClick={() => toast('Press kit & editorial inquiries: press@sukhyatri.in', 'info')}
                  className="hover:text-white transition text-left"
                >
                  Press &amp; Media
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Support & Contact */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-sand mb-4">
              Support &amp; Contact
            </div>
            <div className="space-y-3 text-xs text-white/70 leading-relaxed">
              <div className="flex items-start gap-2">
                <Phone className="w-3.5 h-3.5 text-sand shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white">1800-419-2026</div>
                  <div className="text-[10px] text-white/50">Toll-free · 9 AM to 9 PM IST</div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Mail className="w-3.5 h-3.5 text-sand shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white">hello@sukhyatri.in</div>
                  <div className="text-[10px] text-white/50">Replies within 2 hours</div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-sand shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white">Kochi HQ &amp; Delhi Studio</div>
                  <div className="text-[10px] text-white/50">Marine Drive &amp; Hauz Khas</div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/contact"
                  className="text-xs font-bold text-sand hover:underline flex items-center gap-1"
                >
                  Visit Contact Page →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Subscription Strip */}
        <div className="mt-12 pt-8 border-t border-white/10 grid lg:grid-cols-[1.5fr_1fr] gap-6 items-center">
          <div>
            <div className="font-display text-xl font-bold text-white">
              Get ₹1,500 off your first yatra
            </div>
            <p className="text-white/60 text-xs mt-1 leading-relaxed">
              Join 1.2 lakh travellers receiving one thoughtful email a month. No spam, ever.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="flex gap-2">
            <input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="you@domain.com"
              className="bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-white/40 outline-none focus:border-sand flex-1"
              required
            />
            <Button
              type="submit"
              variant="gold"
              size="sm"
              className="!px-4 shrink-0"
              rightIcon={<Send className="w-3.5 h-3.5" />}
            >
              Join
            </Button>
          </form>
        </div>

        {/* Legal & Copyright */}
        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-[11px] text-white/50 font-medium">
          <div>
            © 2026 SukhYatri Travel Pvt. Ltd. · Kochi · Delhi · Bengaluru · CIN U63040KL2019PTC000000
          </div>
          <div className="flex gap-4">
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span>·</span>
            <span className="hover:text-white cursor-pointer">Terms of Service</span>
            <span>·</span>
            <span className="hover:text-white cursor-pointer">48-Hr Cancellation Rules</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
