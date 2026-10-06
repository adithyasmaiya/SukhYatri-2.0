import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  X,
  ArrowUpDown,
  RotateCcw,
  Sparkles,
  MapPin,
} from 'lucide-react';
import { apiService, ExploreFilterOptions } from '../services/api';
import { TripPackage, TravelStyle, DurationFilter, SortOption } from '../types';
import { TripCard } from '../components/travel/TripCard';
import { EmptyState } from '../components/ui/EmptyState';
import { CardSkeleton } from '../components/ui/LoadingState';
import { ConciergeModal } from '../components/travel/ConciergeModal';
import {
  ExploreFilterPanel,
  TRAVEL_STYLES,
} from '../components/explore/ExploreFilterPanel';
import { ExploreMobileFilterDrawer } from '../components/explore/ExploreMobileFilterDrawer';
import { useSEO } from '../hooks/useSEO';

const POPULAR_SEARCH_CHIPS = ['Goa', 'Coorg', 'Manali', 'Kashmir', 'Kerala'];

const SORT_OPTIONS: { id: SortOption; label: string }[] = [
  { id: 'recommended', label: 'Recommended' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'rating-desc', label: 'Highest Rated' },
  { id: 'duration-asc', label: 'Shortest Duration' },
  { id: 'duration-desc', label: 'Longest Duration' },
];

export const ExplorePage: React.FC = () => {
  useSEO({
    title: 'Explore Trips | SukhYatri',
    description: 'Explore handpicked luxury holiday packages across India. Find your next tranquil retreat or royal heritage journey.',
    canonical: window.location.origin + '/explore',
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState<string>(searchParams.get('search') || '');
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>(() => {
    const d = searchParams.get('destination');
    return d ? d.split(',').filter(Boolean) : [];
  });
  const [selectedStyles, setSelectedStyles] = useState<TravelStyle[]>(() => {
    const s = searchParams.get('style');
    if (!s) return [];
    return s.split(',').filter((val) => TRAVEL_STYLES.includes(val as TravelStyle)) as TravelStyle[];
  });
  const [selectedDuration, setSelectedDuration] = useState<DurationFilter>(
    (searchParams.get('duration') as DurationFilter) || ''
  );
  const [maxPrice, setMaxPrice] = useState<number>(() => {
    const p = searchParams.get('maxPrice');
    return p ? Number(p) : 100000;
  });
  const [minRating, setMinRating] = useState<number>(() => {
    const r = searchParams.get('minRating');
    return r ? Number(r) : 0;
  });
  const [sortBy, setSortBy] = useState<SortOption>(
    (searchParams.get('sort') as SortOption) || 'recommended'
  );

  // UI state
  const [packages, setPackages] = useState<TripPackage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);
  const [isConciergeOpen, setIsConciergeOpen] = useState<boolean>(false);

  // Sync state to URL Query Parameters
  const updateUrlParams = useCallback(
    (newFilters: {
      search?: string;
      destinations?: string[];
      styles?: TravelStyle[];
      duration?: DurationFilter;
      maxPrice?: number;
      minRating?: number;
      sort?: SortOption;
    }) => {
      const params = new URLSearchParams();

      const searchVal = newFilters.search !== undefined ? newFilters.search : searchTerm;
      if (searchVal.trim()) params.set('search', searchVal.trim());

      const dests = newFilters.destinations !== undefined ? newFilters.destinations : selectedDestinations;
      if (dests.length > 0) params.set('destination', dests.join(','));

      const styles = newFilters.styles !== undefined ? newFilters.styles : selectedStyles;
      if (styles.length > 0) params.set('style', styles.join(','));

      const dur = newFilters.duration !== undefined ? newFilters.duration : selectedDuration;
      if (dur) params.set('duration', dur);

      const price = newFilters.maxPrice !== undefined ? newFilters.maxPrice : maxPrice;
      if (price < 100000) params.set('maxPrice', price.toString());

      const rating = newFilters.minRating !== undefined ? newFilters.minRating : minRating;
      if (rating > 0) params.set('minRating', rating.toString());

      const sort = newFilters.sort !== undefined ? newFilters.sort : sortBy;
      if (sort && sort !== 'recommended') params.set('sort', sort);

      setSearchParams(params, { replace: true });
    },
    [searchTerm, selectedDestinations, selectedStyles, selectedDuration, maxPrice, minRating, sortBy, setSearchParams]
  );

  // Listen to searchParams changes (e.g. from back/forward or external navigation)
  useEffect(() => {
    const s = searchParams.get('search') || '';
    setSearchTerm(s);

    const d = searchParams.get('destination');
    setSelectedDestinations(d ? d.split(',').filter(Boolean) : []);

    const styleStr = searchParams.get('style');
    setSelectedStyles(
      styleStr
        ? (styleStr.split(',').filter((v) => TRAVEL_STYLES.includes(v as TravelStyle)) as TravelStyle[])
        : []
    );

    setSelectedDuration((searchParams.get('duration') as DurationFilter) || '');

    const p = searchParams.get('maxPrice');
    setMaxPrice(p ? Number(p) : 100000);

    const r = searchParams.get('minRating');
    setMinRating(r ? Number(r) : 0);

    setSortBy((searchParams.get('sort') as SortOption) || 'recommended');
  }, [searchParams]);

  // Load packages based on current filters
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const filterOpts: ExploreFilterOptions = {
      search: searchTerm,
      destinations: selectedDestinations,
      travelStyle: selectedStyles,
      duration: selectedDuration,
      maxPrice: maxPrice >= 100000 ? undefined : maxPrice,
      minRating: minRating > 0 ? minRating : undefined,
      sort: sortBy,
    };

    // Simulate realistic snappy loading for skeleton state
    const timer = setTimeout(() => {
      apiService.getPackages(filterOpts).then((res) => {
        if (isMounted) {
          setPackages(res);
          setLoading(false);
        }
      });
    }, 120);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [
    searchTerm,
    selectedDestinations,
    selectedStyles,
    selectedDuration,
    maxPrice,
    minRating,
    sortBy,
  ]);

  // Filter Handlers
  const handleDestinationToggle = (dest: string) => {
    const next = selectedDestinations.includes(dest)
      ? selectedDestinations.filter((d) => d !== dest)
      : [...selectedDestinations, dest];
    setSelectedDestinations(next);
    updateUrlParams({ destinations: next });
  };

  const handlePriceChange = (val: number) => {
    setMaxPrice(val);
    updateUrlParams({ maxPrice: val });
  };

  const handleDurationChange = (dur: DurationFilter) => {
    setSelectedDuration(dur);
    updateUrlParams({ duration: dur });
  };

  const handleStyleToggle = (style: TravelStyle) => {
    const next = selectedStyles.includes(style)
      ? selectedStyles.filter((s) => s !== style)
      : [...selectedStyles, style];
    setSelectedStyles(next);
    updateUrlParams({ styles: next });
  };

  const handleRatingChange = (val: number) => {
    setMinRating(val);
    updateUrlParams({ minRating: val });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as SortOption;
    setSortBy(val);
    updateUrlParams({ sort: val });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrlParams({ search: searchTerm });
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    updateUrlParams({ search: '' });
  };

  const handleQuickChip = (chip: string) => {
    setSearchTerm(chip);
    updateUrlParams({ search: chip });
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedDestinations([]);
    setSelectedStyles([]);
    setSelectedDuration('');
    setMaxPrice(100000);
    setMinRating(0);
    setSortBy('recommended');
    setSearchParams({}, { replace: true });
  };

  // Active filter badge count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    count += selectedDestinations.length;
    count += selectedStyles.length;
    if (selectedDuration) count += 1;
    if (maxPrice < 100000) count += 1;
    if (minRating > 0) count += 1;
    return count;
  }, [selectedDestinations, selectedStyles, selectedDuration, maxPrice, minRating]);

  return (
    <div className="min-h-screen bg-cream text-ink pb-20">
      {/* ================= PAGE HEADER ================= */}
      <section className="bg-pinedark text-white relative overflow-hidden py-14 lg:py-20 border-b border-white/10">
        {/* Subtle Background Visual */}
        <div className="absolute inset-0 pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2000&auto=format&fit=crop"
            alt="Scenic India landscape"
            className="w-full h-full object-cover opacity-20 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-pinedark/70 via-pinedark/60 to-pinedark" />
        </div>

        <div className="relative max-w-[1280px] mx-auto px-5 lg:px-8 space-y-6">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 text-xs font-bold text-sand uppercase tracking-[0.2em]">
            <Sparkles className="w-3.5 h-3.5 text-sand" />
            Curated Indian Journeys
          </div>

          {/* Heading & Supporting Copy */}
          <div>
            <h1 className="font-display font-semibold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-white leading-tight">
              Explore your next journey
            </h1>
            <p className="text-white/80 text-sm sm:text-base lg:text-lg mt-2 max-w-2xl leading-relaxed">
              Discover curated experiences, comfortable stays and unforgettable journeys across India.
            </p>
          </div>

          {/* Prominent Search Bar */}
          <div className="pt-2 max-w-3xl">
            <form
              onSubmit={handleSearchSubmit}
              className="bg-white rounded-2xl p-2 shadow-lift flex items-center gap-2 border border-white/20 transition-all focus-within:ring-2 focus-within:ring-sand"
            >
              <div className="pl-3 text-muted">
                <Search className="w-5 h-5 text-pine" />
              </div>
              <label htmlFor="explore-search-input" className="sr-only">
                Search trips by destination, name, or state
              </label>
              <input
                id="explore-search-input"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by destination (e.g. Goa, Coorg, Manali, Kashmir), trip title, or state…"
                className="w-full bg-transparent text-sm sm:text-base font-semibold text-ink placeholder:text-muted/70 outline-none px-2 py-1.5"
              />

              {searchTerm && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="w-8 h-8 rounded-full hover:bg-cream2 flex items-center justify-center text-muted hover:text-ink transition mr-1"
                  aria-label="Clear search text"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              <button
                type="submit"
                className="bg-pine text-white text-xs sm:text-sm font-extrabold px-5 sm:px-6 py-3 rounded-xl hover:bg-moss transition shadow-sm shrink-0"
              >
                Search
              </button>
            </form>

            {/* Example Popular Searches */}
            <div className="flex flex-wrap items-center gap-2 mt-3.5 text-xs text-white/80">
              <span className="font-bold text-sandlight flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-sand" /> Popular:
              </span>
              {POPULAR_SEARCH_CHIPS.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleQuickChip(chip)}
                  className={`rounded-full px-3 py-1 font-semibold border transition ${
                    searchTerm.toLowerCase() === chip.toLowerCase()
                      ? 'bg-sand text-ink border-sand font-bold'
                      : 'bg-white/10 text-white/90 border-white/20 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= MOBILE STICKY CONTROLS ================= */}
      <div className="lg:hidden sticky top-[72px] z-30 bg-cream/95 backdrop-blur-md border-b border-stonewarm py-3 px-5 shadow-sm">
        <div className="flex items-center gap-2.5">
          {/* Mobile Filter Button */}
          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 bg-white border border-stonewarm rounded-2xl py-2.5 px-4 text-xs font-bold text-ink shadow-sm active:scale-98 transition"
            aria-label={`Open filter sheet. ${activeFiltersCount} filters active`}
          >
            <SlidersHorizontal className="w-4 h-4 text-pine" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-sand text-ink text-[11px] font-extrabold flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Mobile Sort Dropdown */}
          <div className="relative flex-1">
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="w-full bg-white border border-stonewarm rounded-2xl py-2.5 pl-3 pr-8 text-xs font-bold text-ink appearance-none shadow-sm cursor-pointer outline-none"
              aria-label="Sort packages"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-muted pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      {/* ================= MAIN CONTENT AREA ================= */}
      <div className="max-w-[1280px] mx-auto px-5 lg:px-8 pt-8">
        <div className="grid lg:grid-cols-[280px_1fr] gap-8 items-start">
          {/* Desktop Left Filter Sidebar */}
          <aside className="hidden lg:block sticky top-24 bg-white rounded-3xl border border-stonewarm p-6 shadow-card">
            <ExploreFilterPanel
              selectedDestinations={selectedDestinations}
              onDestinationToggle={handleDestinationToggle}
              maxPrice={maxPrice}
              onPriceChange={handlePriceChange}
              selectedDuration={selectedDuration}
              onDurationChange={handleDurationChange}
              selectedStyles={selectedStyles}
              onStyleToggle={handleStyleToggle}
              minRating={minRating}
              onRatingChange={handleRatingChange}
              onClearFilters={handleClearFilters}
              activeFiltersCount={activeFiltersCount}
            />
          </aside>

          {/* Results Main Area */}
          <main className="space-y-6">
            {/* Results Header Bar */}
            <div className="bg-white rounded-2xl border border-stonewarm p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
              {/* Dynamic Journey Count */}
              <div>
                <div className="font-display text-xl sm:text-2xl font-bold text-ink flex items-center gap-2">
                  <span>
                    {loading ? 'Searching…' : `${packages.length} journeys found`}
                  </span>
                </div>
                <p className="text-xs text-muted font-medium mt-0.5">
                  Verified boutique stays, rested drivers &amp; slow-paced circuits
                </p>
              </div>

              {/* Desktop Sort Dropdown */}
              <div className="hidden sm:flex items-center gap-2.5">
                <span className="text-xs font-bold text-muted uppercase tracking-wider shrink-0">
                  Sort by:
                </span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={handleSortChange}
                    className="bg-cream2 font-bold text-xs rounded-xl pl-3 pr-8 py-2.5 outline-none cursor-pointer text-ink appearance-none border border-stonewarm hover:border-pine transition"
                    aria-label="Sort trip packages"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ArrowUpDown className="w-3.5 h-3.5 text-muted pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            {/* Active Filters Pill Bar */}
            {(activeFiltersCount > 0 || searchTerm) && (
              <div className="flex flex-wrap items-center gap-2 pt-1 pb-2">
                <span className="text-xs font-bold text-muted">Active filters:</span>

                {searchTerm && (
                  <span className="inline-flex items-center gap-1.5 bg-white border border-stonewarm rounded-full px-3 py-1 text-xs font-bold text-ink shadow-sm">
                    Keyword: “{searchTerm}”
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="hover:text-clay text-muted"
                      aria-label="Remove keyword filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {selectedDestinations.map((dest) => (
                  <span
                    key={dest}
                    className="inline-flex items-center gap-1.5 bg-white border border-stonewarm rounded-full px-3 py-1 text-xs font-bold text-pine shadow-sm"
                  >
                    {dest}
                    <button
                      type="button"
                      onClick={() => handleDestinationToggle(dest)}
                      className="hover:text-clay text-muted"
                      aria-label={`Remove ${dest} filter`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}

                {selectedStyles.map((style) => (
                  <span
                    key={style}
                    className="inline-flex items-center gap-1.5 bg-white border border-stonewarm rounded-full px-3 py-1 text-xs font-bold text-moss shadow-sm"
                  >
                    {style}
                    <button
                      type="button"
                      onClick={() => handleStyleToggle(style)}
                      className="hover:text-clay text-muted"
                      aria-label={`Remove ${style} style filter`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}

                {selectedDuration && (
                  <span className="inline-flex items-center gap-1.5 bg-white border border-stonewarm rounded-full px-3 py-1 text-xs font-bold text-ink shadow-sm">
                    Duration: {selectedDuration}
                    <button
                      type="button"
                      onClick={() => handleDurationChange('')}
                      className="hover:text-clay text-muted"
                      aria-label="Remove duration filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {maxPrice < 100000 && (
                  <span className="inline-flex items-center gap-1.5 bg-white border border-stonewarm rounded-full px-3 py-1 text-xs font-bold text-ink shadow-sm">
                    Up to ₹{maxPrice.toLocaleString('en-IN')}
                    <button
                      type="button"
                      onClick={() => handlePriceChange(100000)}
                      className="hover:text-clay text-muted"
                      aria-label="Reset max price filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {minRating > 0 && (
                  <span className="inline-flex items-center gap-1.5 bg-white border border-stonewarm rounded-full px-3 py-1 text-xs font-bold text-ink shadow-sm">
                    {minRating}+ Stars
                    <button
                      type="button"
                      onClick={() => handleRatingChange(0)}
                      className="hover:text-clay text-muted"
                      aria-label="Reset min rating filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="text-xs font-bold text-clay hover:underline flex items-center gap-1 ml-1"
                >
                  <RotateCcw className="w-3 h-3" /> Reset all
                </button>
              </div>
            )}

            {/* Results Grid / Loading / Empty States */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            ) : packages.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {packages.map((trip) => (
                  <TripCard key={trip.id} trip={trip} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No journeys found"
                description="We couldn't find any trips matching your current search or filters. Try relaxing your price slider, unchecking destinations, or searching for a different keyword."
                actionText="Clear Filters"
                onAction={handleClearFilters}
              />
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <ExploreMobileFilterDrawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        resultsCount={packages.length}
        selectedDestinations={selectedDestinations}
        onDestinationToggle={handleDestinationToggle}
        maxPrice={maxPrice}
        onPriceChange={handlePriceChange}
        selectedDuration={selectedDuration}
        onDurationChange={handleDurationChange}
        selectedStyles={selectedStyles}
        onStyleToggle={handleStyleToggle}
        minRating={minRating}
        onRatingChange={handleRatingChange}
        onClearFilters={handleClearFilters}
        activeFiltersCount={activeFiltersCount}
      />

      {/* Travel Concierge Modal */}
      <ConciergeModal
        isOpen={isConciergeOpen}
        onClose={() => setIsConciergeOpen(false)}
      />
    </div>
  );
};
