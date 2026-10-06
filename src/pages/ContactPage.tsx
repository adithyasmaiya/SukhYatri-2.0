import React, { useState } from 'react';
import { Mail, Phone, MapPin, MessageCircle, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useToast } from '../context/ToastContext';

export const ContactPage: React.FC = () => {
  const { toast } = useToast();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [topic, setTopic] = useState('New booking');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const topics = [
    'New booking',
    'Customise a trip',
    'Honeymoon special',
    'Corporate / MICE',
    'On-trip support',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !email.includes('@') || message.length < 10) {
      toast('Please enter your name, valid email, and a message (10+ characters)', 'error');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast(
        `Dhanyavaad, ${firstName}! We received your inquiry regarding <b>${topic}</b>. Our travel designer will reply within 2 hours.`,
        'success'
      );
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
      setMessage('');
    }, 600);
  };

  return (
    <div className="max-w-[1280px] mx-auto px-5 lg:px-8 py-12 grid lg:grid-cols-[1fr_420px] gap-10 items-start">
      {/* Contact Form */}
      <div className="bg-white rounded-3xl border border-stonewarm p-7 lg:p-10 shadow-card space-y-6">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-moss mb-2">
            Contact &amp; Studios · Replies in ~2 hrs
          </div>
          <h1 className="font-display text-3xl lg:text-4xl font-semibold text-ink">
            Namaste! How can we help?
          </h1>
          <p className="text-xs text-muted mt-2 leading-relaxed">
            Customised route? Honeymoon surprise? Large family group? Tell us everything.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="First Name *"
              placeholder="e.g. Ananya"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <Input
              label="Last Name"
              placeholder="e.g. Sharma"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Email Address *"
              type="email"
              placeholder="you@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Phone / WhatsApp"
              placeholder="+91 98200 00000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-[0.18em] text-muted mb-2">
              What’s this about?
            </label>
            <div className="flex flex-wrap gap-2">
              {topics.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTopic(t)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition ${
                    topic === t
                      ? 'bg-pine text-white border-pine shadow-sm'
                      : 'bg-white text-ink border-stonewarm hover:border-pine'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-[0.18em] text-muted mb-1.5">
              Message *
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="We are 4 friends travelling to Kerala in December, wanting a slow pace, quiet tea estates, and incredible local food…"
              className="w-full bg-white border-1.5 border-stonewarm rounded-2xl p-3.5 text-xs text-ink outline-none focus:border-moss"
              required
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full !rounded-2xl"
            isLoading={loading}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Send Message to Travel Designer
          </Button>

          <p className="text-[11px] text-muted text-center pt-2">
            Prefer talking? Call <b>1800-419-2026</b> · 9 AM to 9 PM IST, all days.
          </p>
        </form>
      </div>

      {/* Studio Info Sidebar */}
      <div className="space-y-6">
        <div className="bg-pinedark text-white rounded-3xl p-7 space-y-6 shadow-lift">
          <h3 className="font-display text-2xl font-semibold">Visit our studios</h3>

          <div className="space-y-5 text-xs">
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-sand" />
              </div>
              <div>
                <b className="text-white text-sm">Kochi HQ Studio</b>
                <div className="text-white/70 mt-0.5 leading-relaxed">
                  4th Floor, Marine Drive Waterfront, Kochi, Kerala 682031
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-sand" />
              </div>
              <div>
                <b className="text-white text-sm">Delhi Atelier</b>
                <div className="text-white/70 mt-0.5 leading-relaxed">
                  Hauz Khas Village, New Delhi 110016
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4 text-sand" />
              </div>
              <div>
                <b className="text-white text-sm">hello@sukhyatri.in</b>
                <div className="text-white/70 mt-0.5">care@sukhyatri.in for urgent travel lines</div>
              </div>
            </div>
          </div>

          <Button
            variant="gold"
            className="w-full !rounded-2xl"
            onClick={() =>
              toast('Opening official SukhYatri WhatsApp concierge (+91 98200 41926)…', 'info')
            }
            leftIcon={<MessageCircle className="w-4 h-4 text-ink" />}
          >
            WhatsApp us instantly
          </Button>
        </div>

        {/* Quick Questions Card */}
        <div className="bg-white rounded-3xl border border-stonewarm p-6 shadow-card space-y-3">
          <h4 className="font-bold text-sm text-ink mb-1">Quick answers</h4>
          {[
            {
              q: 'Can I customise any trip?',
              a: 'Yes — 83% of trips are tweaked. Hotels, pace, meal preferences are modified for free.',
            },
            {
              q: 'Do you offer EMI?',
              a: 'Yes, 0% EMI on major bank credit cards + UPI auto-pay for balance clearance.',
            },
            {
              q: 'Is my money secure?',
              a: '100% secure escrow accounts, IATA certified, GST invoices provided immediately.',
            },
          ].map((item, i) => (
            <div key={i} className="bg-cream2/60 rounded-xl p-3 text-xs">
              <b className="text-ink">{item.q}</b>
              <p className="text-muted mt-0.5">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
