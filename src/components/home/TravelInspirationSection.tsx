import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Clock, Calendar } from 'lucide-react';
import { JOURNAL_ARTICLES } from '../../data/journal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export const TravelInspirationSection: React.FC = () => {
  const navigate = useNavigate();

  // Primary featured story (large imagery) and secondary supporting stories
  const featuredArticle = JOURNAL_ARTICLES[0];
  const supportingArticles = JOURNAL_ARTICLES.slice(1, 3);

  return (
    <section className="max-w-[1280px] mx-auto px-5 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-moss mb-2">
            05 — The SukhYatri Journal
          </div>
          <h2 className="font-display text-3xl lg:text-[44px] font-semibold tracking-tight text-ink leading-tight">
            Travel Inspiration &amp; Field Notes
          </h2>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate('/about')}
          rightIcon={<ArrowRight className="w-4 h-4" />}
          className="self-start sm:self-auto"
        >
          View all stories
        </Button>
      </div>

      {/* Editorial Magazine Layout: 7 cols main story + 5 cols stacked stories */}
      <div className="grid lg:grid-cols-12 gap-8 items-stretch">
        {/* Main Large Editorial Card */}
        {featuredArticle && (
          <div
            onClick={() => navigate('/about')}
            className="lg:col-span-7 group relative rounded-[32px] overflow-hidden bg-cream2 border border-stonewarm shadow-card hover:shadow-lift transition-all duration-500 cursor-pointer flex flex-col justify-end min-h-[440px] lg:min-h-[520px]"
          >
            {/* Full Background Image with Zoom */}
            <div className="absolute inset-0 overflow-hidden">
              <img
                src={featuredArticle.image}
                alt={featuredArticle.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent" />
            </div>

            {/* Top Tag */}
            <div className="relative z-10 p-6 lg:p-8 flex items-center justify-between">
              <Badge variant="sand" size="sm" className="font-bold tracking-wide">
                Cover Story · {featuredArticle.category}
              </Badge>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-white/80 bg-black/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                <Clock className="w-3.5 h-3.5 text-sand" />
                <span>{featuredArticle.readTime}</span>
              </div>
            </div>

            {/* Bottom Content */}
            <div className="relative z-10 p-6 lg:p-8 space-y-3 mt-auto text-white">
              <div className="flex items-center gap-2 text-xs text-sand font-bold">
                <Calendar className="w-3.5 h-3.5" />
                <span>{featuredArticle.date}</span>
                <span>·</span>
                <span>By SukhYatri Editorial</span>
              </div>

              <h3 className="font-display text-2xl lg:text-3xl font-semibold leading-snug group-hover:text-sandlight transition-colors">
                {featuredArticle.title}
              </h3>

              <p className="text-white/80 text-sm leading-relaxed max-w-xl line-clamp-2">
                {featuredArticle.description}
              </p>

              <div className="pt-2">
                <span className="inline-flex items-center gap-2 text-sand text-sm font-bold group-hover:translate-x-1.5 transition-transform duration-300">
                  Read complete guide <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Stacked Supporting Story Cards (Right Column) */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-6">
          {supportingArticles.map((article) => (
            <div
              key={article.id}
              onClick={() => navigate('/about')}
              className="group bg-white rounded-[28px] border border-stonewarm p-5 lg:p-6 shadow-card hover:-translate-y-1 hover:shadow-lift transition-all duration-300 cursor-pointer flex-1 flex flex-col justify-between"
            >
              <div className="flex gap-5">
                {/* Thumbnail */}
                <div className="w-28 sm:w-36 h-28 sm:h-32 rounded-2xl overflow-hidden shrink-0 bg-cream2">
                  <img
                    src={article.image}
                    alt={article.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  />
                </div>

                {/* Meta & Title */}
                <div className="flex-1 flex flex-col">
                  <div className="flex items-center gap-2 text-[11px] font-bold text-muted mb-1.5">
                    <span className="text-moss uppercase tracking-wider">{article.category}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-sand" /> {article.readTime}
                    </span>
                  </div>

                  <h4 className="font-display text-base lg:text-lg font-semibold text-ink group-hover:text-moss transition-colors leading-snug">
                    {article.title}
                  </h4>

                  <p className="text-xs text-muted mt-1.5 leading-relaxed line-clamp-2 hidden sm:block">
                    {article.description}
                  </p>
                </div>
              </div>

              {/* Card Footer Link */}
              <div className="mt-4 pt-3 border-t border-stonewarm/60 flex items-center justify-between text-xs font-bold">
                <span className="text-muted">{article.date}</span>
                <span className="text-pine group-hover:text-moss group-hover:translate-x-1 transition-all inline-flex items-center gap-1">
                  Read story →
                </span>
              </div>
            </div>
          ))}

          {/* Travel Consultation Mini Promo Box */}
          <div className="bg-pine rounded-[28px] p-6 text-white flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-sand">
                <BookOpen className="w-4 h-4" />
                <span>Complimentary Planning Guide</span>
              </div>
              <h4 className="font-display text-base font-semibold">
                Download our 2026 Slow Travel Atlas
              </h4>
            </div>
            <button
              onClick={() => navigate('/about')}
              className="px-4 py-2 rounded-xl bg-white text-pine font-extrabold text-xs hover:bg-sandlight transition shrink-0"
            >
              Get Free PDF
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
