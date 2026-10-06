import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-pinedark text-white py-16 lg:py-24 text-center">
        <img
          src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1800&auto=format&fit=crop"
          alt="Himalayan pass"
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-pinedark/40 to-pinedark" />

        <div className="relative max-w-[1280px] mx-auto px-5 lg:px-8">
          <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-sand mb-3">
            Our Story · Rooted Since 2019
          </div>
          <h1 className="font-display text-4xl lg:text-6xl font-semibold tracking-tight max-w-3xl mx-auto leading-tight">
            We started with one Sumo, six strangers &amp; a dream of{' '}
            <span className="italic text-sandlight">comfortable India</span>
          </h1>
          <p className="text-white/75 max-w-xl mx-auto mt-5 text-sm lg:text-base leading-relaxed">
            Sukh (comfort) + Yatri (traveller). Today: 1.2 lakh yatris, 48 curated routes, one
            singular obsession — India, felt deeply, travelled softly.
          </p>
        </div>
      </section>

      {/* Why We Exist */}
      <section className="max-w-[1280px] mx-auto px-5 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-moss">
            Why We Exist
          </div>
          <h2 className="font-display text-3xl lg:text-4xl font-semibold text-ink leading-tight">
            India is breathtaking. Getting around it shouldn't take your breath away.
          </h2>
          <p className="text-muted leading-relaxed text-sm lg:text-base">
            Our founders — a Ladakhi driver-turned-expedition lead, a Kerala heritage homestay host,
            and a Mumbai product designer — kept meeting travellers who adored India’s culture but
            dreaded its travel friction.
          </p>
          <p className="text-muted leading-relaxed text-sm lg:text-base">
            SukhYatri was founded to fix the unsexy stuff: verified spotlessly clean washrooms,
            well-rested drivers with mandated rest hours, honest travel timelines, high-altitude
            doctors on call, and regional food your stomach trusts.
          </p>

          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="bg-white border border-stonewarm rounded-2xl p-4 text-center shadow-sm">
              <div className="font-display text-2xl font-bold text-pine">2019</div>
              <div className="text-[11px] font-bold text-muted mt-1">Founded in Kochi</div>
            </div>
            <div className="bg-white border border-stonewarm rounded-2xl p-4 text-center shadow-sm">
              <div className="font-display text-2xl font-bold text-pine">120+</div>
              <div className="text-[11px] font-bold text-muted mt-1">Local Host Partners</div>
            </div>
            <div className="bg-white border border-stonewarm rounded-2xl p-4 text-center shadow-sm">
              <div className="font-display text-2xl font-bold text-pine">28</div>
              <div className="text-[11px] font-bold text-muted mt-1">States Welcomed</div>
            </div>
          </div>
        </div>

        {/* Mosaic Images */}
        <div className="grid grid-cols-2 gap-4">
          <img
            src="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=800&auto=format&fit=crop"
            alt="Kerala backwaters"
            className="rounded-3xl h-60 w-full object-cover shadow-card"
          />
          <img
            src="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=800&auto=format&fit=crop"
            alt="Goa villa"
            className="rounded-3xl h-60 w-full object-cover shadow-card mt-6"
          />
          <img
            src="https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=800&auto=format&fit=crop"
            alt="Taj Mahal"
            className="rounded-3xl h-60 w-full object-cover shadow-card -mt-6"
          />
          <img
            src="https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=800&auto=format&fit=crop"
            alt="Rajasthan haveli"
            className="rounded-3xl h-60 w-full object-cover shadow-card"
          />
        </div>
      </section>

      {/* Milestones */}
      <section className="bg-cream2/60 border-y border-stonewarm py-16">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8 space-y-8">
          <div className="text-center max-w-xl mx-auto">
            <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-moss mb-2">
              Milestones
            </div>
            <h2 className="font-display text-3xl font-semibold text-ink">The road travelled so far</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-5">
            {[
              {
                year: '2019',
                title: 'The First Sumo',
                desc: 'Six strangers, Spiti valley, one unforgettable breakdown-turned-bonfire. SukhYatri is born in Kochi.',
              },
              {
                year: '2021',
                title: '10,000 Yatris',
                desc: 'Safely hosted slow, local Kerala bubbles during travel pauses. Awarded 4.9 for guest hygiene.',
              },
              {
                year: '2023',
                title: '48 Routes Live',
                desc: 'Ladakh, Andaman and Rajasthan local studios launched. 24x7 personal concierge service made standard.',
              },
              {
                year: '2026',
                title: '1.2 Lakh Strong',
                desc: '38% repeat traveller rate. Zero hidden fees ever. Still obsessively focused on verified soft beds.',
              },
            ].map((m, i) => (
              <div
                key={i}
                className="bg-white border border-stonewarm rounded-3xl p-6 shadow-sm hover:-translate-y-1 transition-all"
              >
                <div className="font-display text-3xl font-bold text-moss">{m.year}</div>
                <h4 className="font-extrabold text-base text-ink mt-2">{m.title}</h4>
                <p className="text-xs text-muted mt-2 leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="max-w-[1280px] mx-auto px-5 lg:px-8 space-y-8">
        <div className="text-center max-w-xl mx-auto">
          <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-moss mb-2">
            Values
          </div>
          <h2 className="font-display text-3xl font-semibold text-ink">
            What we refuse to compromise
          </h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {[
            {
              title: 'Comfort without guilt',
              desc: 'Premium orthopedic beds and honest pricing. Honest luxury that does not demand a second mortgage.',
            },
            {
              title: 'Hosts, not vendors',
              desc: '120+ local partners paid fairly, with dignity, and always on time. Your travel spend stays directly in the hills.',
            },
            {
              title: 'Slow over checklist',
              desc: 'Fewer sights, deeper memories. We will never rush your morning cup of chai for a crowded tourist viewpoint.',
            },
          ].map((v, i) => (
            <div
              key={i}
              className="bg-white border border-stonewarm rounded-3xl p-7 text-center shadow-card"
            >
              <div className="w-12 h-12 mx-auto rounded-2xl bg-sandlight text-pine font-display text-xl flex items-center justify-center font-bold">
                ✦
              </div>
              <h4 className="font-extrabold text-lg text-ink mt-4">{v.title}</h4>
              <p className="text-xs text-muted mt-2 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>

        {/* Hiring CTA Banner */}
        <div className="bg-pine text-white rounded-[30px] p-8 lg:p-12 grid lg:grid-cols-2 gap-8 items-center shadow-lift">
          <div>
            <h3 className="font-display text-3xl font-semibold leading-tight">
              Come, build the future of Indian travel with us
            </h3>
            <p className="text-white/75 mt-3 text-xs lg:text-sm leading-relaxed">
              We are hiring regional travel designers, certified naturalists, and software engineers
              across Kochi, Delhi &amp; remote.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 lg:justify-end">
            <Button variant="gold" onClick={() => navigate('/contact')}>
              View Open Roles
            </Button>
            <Button variant="ghostlight" onClick={() => navigate('/explore')}>
              Travel With Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
