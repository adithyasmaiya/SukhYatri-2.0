import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  ExternalLink,
  Clock,
  Sparkles,
  HelpCircle,
  Hotel,
  Layers,
  Image as ImageIcon,
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { toSlug, formatDate } from '../../utils/format';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../context/ToastContext';
import { ImageGalleryManager } from '../../components/admin/ImageGalleryManager';

export const AdminPackageFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [destinationsList, setDestinationsList] = useState<any[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [destinationName, setDestinationName] = useState('Kerala');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');

  // Pricing
  const [price, setPrice] = useState<number>(38500);
  const [originalPrice, setOriginalPrice] = useState<number>(45000);

  // Trip
  const [duration, setDuration] = useState('6 Days / 5 Nights');
  const [travelStyle, setTravelStyle] = useState('Slow & Heritage');
  const [highlights, setHighlights] = useState<string[]>([
    'Curated heritage boutique stays',
    'Dedicated private sanitized chauffeur',
    'Authentic local culinary experiences',
  ]);

  // Images
  const [heroImage, setHeroImage] = useState(
    'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80'
  );
  const [gallery, setGallery] = useState<string[]>([
    'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=800&q=80',
  ]);

  // Dynamic Day-by-Day Itinerary
  const [itinerary, setItinerary] = useState<any[]>([
    {
      day: 1,
      title: 'Arrival & Welcome Refreshment',
      description: 'Private chauffeur meets you at arrival terminal. Settle in with traditional welcome drinks and evening stroll.',
      activities: 'Chauffeur airport transfer, check-in, orientation dinner',
      location: 'Arrival Hub',
      image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80',
    },
    {
      day: 2,
      title: 'Heritage Trails & Cultural Immersion',
      description: 'Morning guided walk through ancient spice markets and historic landmarks.',
      activities: 'Historic walking tour, organic lunch tasting',
      location: 'Heritage Quarter',
      image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=600&q=80',
    },
  ]);

  // Inclusions & Exclusions
  const [inclusions, setInclusions] = useState<string[]>([
    'Daily artisan breakfast & farm-to-table dinner',
    'Private air-conditioned chauffeur throughout',
    'All monumental entry permissions & tolls',
  ]);
  const [exclusions, setExclusions] = useState<string[]>([
    'Personal shopping and laundry expenses',
    'Optional flight tickets to arrival airport',
  ]);

  // Accommodation
  const [accommodation, setAccommodation] = useState({
    name: 'Tea Sanctuary & Heritage Retreat',
    category: 'Heritage Boutique Resort',
    description: 'Eco-conscious heritage property surrounded by pristine plantations with modern luxury amenities.',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
    amenities: 'Infinity pool, Ayurvedic spa, Free WiFi, Organic dining',
  });

  // FAQs
  const [faqs, setFaqs] = useState<any[]>([
    {
      question: 'What is the recommended packing guide for this trip?',
      answer: 'Light breathable cottons for daytime exploration, comfortable walking footwear, and a light jacket for breezy evenings.',
    },
  ]);

  // Publishing State
  const [isPublished, setIsPublished] = useState(true);

  // Load available destinations and existing package if editing
  useEffect(() => {
    adminService.getDestinations().then((res) => {
      if (res.destinations) {
        setDestinationsList(res.destinations);
      }
    });

    if (isEdit && id) {
      adminService
        .getPackageById(id)
        .then((pkg) => {
          if (pkg) {
            setTitle(pkg.title || '');
            setSlug(pkg.slug || '');
            setDestinationName(pkg.destinationName || pkg.destination?.name || 'Kerala');
            setShortDescription(pkg.shortDescription || pkg.desc || '');
            setFullDescription(pkg.fullDescription || pkg.desc || '');
            setPrice(pkg.price || 0);
            setOriginalPrice(pkg.originalPrice || pkg.mrp || 0);
            setDuration(pkg.duration || `${pkg.days || 5} Days / ${pkg.nights || 4} Nights`);
            setTravelStyle(pkg.travelStyle || pkg.themes?.[0] || 'Slow & Heritage');
            if (pkg.highlights && pkg.highlights.length) setHighlights(pkg.highlights);
            if (pkg.heroImage || pkg.image) setHeroImage(pkg.heroImage || pkg.image);
            if (pkg.gallery && pkg.gallery.length) setGallery(pkg.gallery);
            if (pkg.itinerary && pkg.itinerary.length) setItinerary(pkg.itinerary);
            if (pkg.inclusions && pkg.inclusions.length) setInclusions(pkg.inclusions);
            if (pkg.exclusions && pkg.exclusions.length) setExclusions(pkg.exclusions);
            if (pkg.accommodation) setAccommodation(pkg.accommodation);
            if (pkg.faqs && pkg.faqs.length) setFaqs(pkg.faqs);
            setIsPublished(pkg.isPublished !== undefined ? pkg.isPublished : true);
            setLastUpdated(pkg.updatedAt || pkg.createdAt || null);
          }
        })
        .catch((err) => {
          toast(err.message || 'Error loading package', 'error');
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  // Auto-slug generator on title blur
  const handleTitleBlur = () => {
    if (!slug && title) {
      setSlug(toSlug(title));
    }
  };

  // Itinerary Handlers
  const addItineraryDay = () => {
    const nextDay = itinerary.length + 1;
    setItinerary([
      ...itinerary,
      {
        day: nextDay,
        title: `Day ${nextDay} Itinerary`,
        description: 'Detail the schedule, sights, and moments of this day.',
        activities: 'Sightseeing, cultural experience',
        location: destinationName,
        image: heroImage,
      },
    ]);
  };

  const removeItineraryDay = (index: number) => {
    const filtered = itinerary.filter((_, i) => i !== index);
    // Renumber days
    const renumbered = filtered.map((item, idx) => ({ ...item, day: idx + 1 }));
    setItinerary(renumbered);
  };

  const moveItineraryDay = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === itinerary.length - 1)
    ) {
      return;
    }
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const items = [...itinerary];
    const [moved] = items.splice(index, 1);
    items.splice(targetIndex, 0, moved);
    const renumbered = items.map((item, idx) => ({ ...item, day: idx + 1 }));
    setItinerary(renumbered);
  };

  const updateItineraryField = (index: number, field: string, value: any) => {
    const items = [...itinerary];
    items[index] = { ...items[index], [field]: value };
    setItinerary(items);
  };

  // Highlights handlers
  const addHighlight = () => setHighlights([...highlights, '']);
  const updateHighlight = (i: number, val: string) => {
    const arr = [...highlights];
    arr[i] = val;
    setHighlights(arr);
  };
  const removeHighlight = (i: number) => setHighlights(highlights.filter((_, idx) => idx !== i));

  // Inclusions handlers
  const addInclusion = () => setInclusions([...inclusions, '']);
  const updateInclusion = (i: number, val: string) => {
    const arr = [...inclusions];
    arr[i] = val;
    setInclusions(arr);
  };
  const removeInclusion = (i: number) => setInclusions(inclusions.filter((_, idx) => idx !== i));

  // Exclusions handlers
  const addExclusion = () => setExclusions([...exclusions, '']);
  const updateExclusion = (i: number, val: string) => {
    const arr = [...exclusions];
    arr[i] = val;
    setExclusions(arr);
  };
  const removeExclusion = (i: number) => setExclusions(exclusions.filter((_, idx) => idx !== i));

  // FAQ handlers
  const addFaq = () => setFaqs([...faqs, { question: '', answer: '' }]);
  const updateFaq = (i: number, field: string, val: string) => {
    const arr = [...faqs];
    arr[i] = { ...arr[i], [field]: val };
    setFaqs(arr);
  };
  const removeFaq = (i: number) => setFaqs(faqs.filter((_, idx) => idx !== i));

  // Validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Package title is required';
    if (!slug.trim()) newErrors.slug = 'URL slug is required';
    if (!destinationName.trim()) newErrors.destinationName = 'Destination is required';
    if (!price || price <= 0) newErrors.price = 'Valid price per person is required';
    if (!duration.trim()) newErrors.duration = 'Trip duration is required';
    if (!heroImage.trim()) newErrors.heroImage = 'Hero image URL is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast('Please correct inline validation errors before saving', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        title: title.trim(),
        slug: slug.trim().toLowerCase(),
        destinationName: destinationName.trim(),
        shortDescription: shortDescription.trim(),
        fullDescription: fullDescription.trim(),
        price: Number(price),
        originalPrice: Number(originalPrice) || Number(price),
        duration: duration.trim(),
        travelStyle: travelStyle.trim(),
        highlights: highlights.filter((h) => h.trim()),
        heroImage: heroImage.trim(),
        image: heroImage.trim(),
        gallery: gallery.filter((g) => g.trim()),
        itinerary,
        inclusions: inclusions.filter((inc) => inc.trim()),
        exclusions: exclusions.filter((exc) => exc.trim()),
        accommodation,
        faqs: faqs.filter((f) => f.question.trim()),
        isPublished,
      };

      if (isEdit && id) {
        await adminService.updatePackage(id, payload);
        toast('Package updated successfully', 'success');
      } else {
        await adminService.createPackage(payload);
        toast('Package created successfully', 'success');
      }
      navigate('/admin/packages');
    } catch (err: any) {
      toast(err.message || 'Unable to update package', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-muted">
        <div className="w-8 h-8 border-4 border-moss border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs">Loading package data…</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/packages"
            className="w-9 h-9 rounded-xl bg-white border border-[#DFE5E2] text-ink flex items-center justify-center hover:bg-[#F2F4F3] transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="font-display text-2xl font-bold text-ink">
              {isEdit ? 'Edit Package' : 'Create New Package'}
            </h2>
            {lastUpdated && (
              <p className="text-xs text-muted flex items-center gap-1 mt-0.5">
                <Clock className="w-3 h-3" />
                <span>Last updated on {formatDate(lastUpdated)}</span>
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isEdit && (
            <Link
              to={`/booking/${id}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#DFE5E2] bg-white text-xs font-semibold text-ink hover:bg-[#F2F4F3] transition"
            >
              <ExternalLink className="w-3.5 h-3.5 text-muted" />
              <span>Preview</span>
            </Link>
          )}

          <Button
            type="submit"
            className="bg-moss hover:bg-moss/90 text-white flex items-center gap-1.5"
            loading={submitting}
          >
            <Save className="w-4 h-4" />
            <span>Save Package</span>
          </Button>
        </div>
      </div>

      {/* 1. Basic Details */}
      <div className="bg-white rounded-3xl border border-[#DFE5E2] p-6 shadow-xs space-y-4">
        <h3 className="font-display text-base font-bold text-ink flex items-center gap-2">
          <Layers className="w-4 h-4 text-moss" />
          <span>Basic Information</span>
        </h3>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-ink block mb-1">
              Package Title <span className="text-clay">*</span>
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleBlur}
              placeholder="e.g. Kerala Slow Backwaters & Tea Trails"
              className={`w-full bg-[#F2F4F3] text-xs font-medium rounded-xl px-3.5 py-2.5 outline-none border text-ink ${
                errors.title ? 'border-clay' : 'border-transparent focus:border-moss/40'
              }`}
            />
            {errors.title && <span className="text-[10.5px] text-clay mt-1 block">{errors.title}</span>}
          </div>

          <div>
            <label className="text-xs font-bold text-ink block mb-1">
              URL Slug <span className="text-clay">*</span>
            </label>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. kerala-slow-backwaters"
              className={`w-full bg-[#F2F4F3] text-xs font-medium rounded-xl px-3.5 py-2.5 outline-none border text-ink ${
                errors.slug ? 'border-clay' : 'border-transparent focus:border-moss/40'
              }`}
            />
            {errors.slug && <span className="text-[10.5px] text-clay mt-1 block">{errors.slug}</span>}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-ink block mb-1">
              Destination <span className="text-clay">*</span>
            </label>
            <select
              value={destinationName}
              onChange={(e) => setDestinationName(e.target.value)}
              className="w-full bg-[#F2F4F3] text-xs font-medium rounded-xl px-3.5 py-2.5 outline-none border border-transparent focus:border-moss/40 text-ink"
            >
              {destinationsList.length > 0 ? (
                destinationsList.map((d) => (
                  <option key={d.slug || d.name} value={d.name}>
                    {d.name} ({d.state})
                  </option>
                ))
              ) : (
                <>
                  <option value="Kerala">Kerala</option>
                  <option value="Goa">Goa</option>
                  <option value="Kashmir">Kashmir</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Himachal Pradesh">Himachal Pradesh</option>
                  <option value="Coorg">Coorg</option>
                </>
              )}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-ink block mb-1">
              Travel Style / Category
            </label>
            <input
              value={travelStyle}
              onChange={(e) => setTravelStyle(e.target.value)}
              placeholder="e.g. Slow Travel, Heritage & Wellness"
              className="w-full bg-[#F2F4F3] text-xs font-medium rounded-xl px-3.5 py-2.5 outline-none border border-transparent focus:border-moss/40 text-ink"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-ink block mb-1">Short Summary</label>
          <input
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            placeholder="A short punchy teaser that highlights this experience..."
            className="w-full bg-[#F2F4F3] text-xs font-medium rounded-xl px-3.5 py-2.5 outline-none border border-transparent focus:border-moss/40 text-ink"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-ink block mb-1">Full Description</label>
          <textarea
            rows={3}
            value={fullDescription}
            onChange={(e) => setFullDescription(e.target.value)}
            placeholder="Comprehensive description of the route and its authentic moments..."
            className="w-full bg-[#F2F4F3] text-xs font-medium rounded-xl p-3 outline-none border border-transparent focus:border-moss/40 text-ink"
          />
        </div>
      </div>

      {/* 2. Pricing & Duration */}
      <div className="bg-white rounded-3xl border border-[#DFE5E2] p-6 shadow-xs space-y-4">
        <h3 className="font-display text-base font-bold text-ink flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-pine" />
          <span>Pricing & Duration</span>
        </h3>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold text-ink block mb-1">
              Price / Person (₹) <span className="text-clay">*</span>
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className={`w-full bg-[#F2F4F3] text-xs font-semibold rounded-xl px-3.5 py-2.5 outline-none border text-ink ${
                errors.price ? 'border-clay' : 'border-transparent focus:border-moss/40'
              }`}
            />
            {errors.price && <span className="text-[10.5px] text-clay mt-1 block">{errors.price}</span>}
          </div>

          <div>
            <label className="text-xs font-bold text-ink block mb-1">Original Price / MRP (₹)</label>
            <input
              type="number"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(Number(e.target.value))}
              className="w-full bg-[#F2F4F3] text-xs font-semibold rounded-xl px-3.5 py-2.5 outline-none border border-transparent focus:border-moss/40 text-ink"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-ink block mb-1">
              Duration <span className="text-clay">*</span>
            </label>
            <input
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g. 6 Days / 5 Nights"
              className={`w-full bg-[#F2F4F3] text-xs font-medium rounded-xl px-3.5 py-2.5 outline-none border text-ink ${
                errors.duration ? 'border-clay' : 'border-transparent focus:border-moss/40'
              }`}
            />
            {errors.duration && (
              <span className="text-[10.5px] text-clay mt-1 block">{errors.duration}</span>
            )}
          </div>
        </div>
      </div>

      {/* 3. Media & Imagery */}
      <div className="bg-white rounded-3xl border border-[#DFE5E2] p-6 shadow-xs space-y-4">
        <ImageGalleryManager
          images={gallery.length > 0 ? gallery : (heroImage ? [heroImage] : [])}
          onChange={(newGallery) => {
            setGallery(newGallery);
            if (newGallery.length > 0 && !newGallery.includes(heroImage)) {
              setHeroImage(newGallery[0]);
            }
          }}
          primaryImage={heroImage}
          onPrimaryChange={(newPrimary) => {
            setHeroImage(newPrimary);
            if (!gallery.includes(newPrimary)) {
              setGallery([newPrimary, ...gallery]);
            }
          }}
          title="Package Visual Media & Gallery"
        />
      </div>

      {/* 4. Day-by-Day Dynamic Itinerary Editor */}
      <div className="bg-white rounded-3xl border border-[#DFE5E2] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-base font-bold text-ink">
            Day-by-Day Itinerary ({itinerary.length} Days)
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addItineraryDay}
            className="flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Day</span>
          </Button>
        </div>

        <div className="space-y-4">
          {itinerary.map((dayItem, index) => (
            <div
              key={index}
              className="p-4.5 rounded-2xl border border-[#E5EAE8] bg-[#FBFDFB] space-y-3 relative group"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs bg-moss text-white px-2.5 py-0.5 rounded-full">
                  Day {dayItem.day}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveItineraryDay(index, 'up')}
                    disabled={index === 0}
                    className="p-1 text-muted hover:text-ink disabled:opacity-30"
                    title="Move Day Up"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveItineraryDay(index, 'down')}
                    disabled={index === itinerary.length - 1}
                    className="p-1 text-muted hover:text-ink disabled:opacity-30"
                    title="Move Day Down"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItineraryDay(index)}
                    className="p-1 text-clay hover:bg-clay/10 rounded-lg ml-2"
                    title="Remove Day"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-muted block mb-0.5">
                    Day Title
                  </label>
                  <input
                    value={dayItem.title}
                    onChange={(e) => updateItineraryField(index, 'title', e.target.value)}
                    className="w-full bg-white text-xs font-semibold rounded-xl px-3 py-2 border border-[#DFE5E2] text-ink outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-muted block mb-0.5">
                    Key Location
                  </label>
                  <input
                    value={dayItem.location}
                    onChange={(e) => updateItineraryField(index, 'location', e.target.value)}
                    className="w-full bg-white text-xs font-semibold rounded-xl px-3 py-2 border border-[#DFE5E2] text-ink outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-muted block mb-0.5">
                  Day Description
                </label>
                <textarea
                  rows={2}
                  value={dayItem.description}
                  onChange={(e) => updateItineraryField(index, 'description', e.target.value)}
                  className="w-full bg-white text-xs rounded-xl p-2.5 border border-[#DFE5E2] text-ink outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-muted block mb-0.5">
                  Activities Summary
                </label>
                <input
                  value={dayItem.activities}
                  onChange={(e) => updateItineraryField(index, 'activities', e.target.value)}
                  className="w-full bg-white text-xs rounded-xl px-3 py-2 border border-[#DFE5E2] text-ink outline-none"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Inclusions & Exclusions */}
      <div className="grid sm:grid-cols-2 gap-6">
        {/* Inclusions */}
        <div className="bg-white rounded-3xl border border-[#DFE5E2] p-6 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-moss">Trip Inclusions</h4>
            <button
              type="button"
              onClick={addInclusion}
              className="text-xs font-bold text-moss hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>
          <div className="space-y-2">
            {inclusions.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  value={item}
                  onChange={(e) => updateInclusion(idx, e.target.value)}
                  className="flex-1 bg-[#F2F4F3] text-xs rounded-xl px-3 py-2 outline-none border border-transparent focus:border-moss/40 text-ink"
                />
                <button
                  type="button"
                  onClick={() => removeInclusion(idx)}
                  className="text-muted hover:text-clay p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Exclusions */}
        <div className="bg-white rounded-3xl border border-[#DFE5E2] p-6 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-clay">Trip Exclusions</h4>
            <button
              type="button"
              onClick={addExclusion}
              className="text-xs font-bold text-clay hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>
          <div className="space-y-2">
            {exclusions.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  value={item}
                  onChange={(e) => updateExclusion(idx, e.target.value)}
                  className="flex-1 bg-[#F2F4F3] text-xs rounded-xl px-3 py-2 outline-none border border-transparent focus:border-moss/40 text-ink"
                />
                <button
                  type="button"
                  onClick={() => removeExclusion(idx)}
                  className="text-muted hover:text-clay p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6. Accommodation Details */}
      <div className="bg-white rounded-3xl border border-[#DFE5E2] p-6 shadow-xs space-y-4">
        <h3 className="font-display text-base font-bold text-ink flex items-center gap-2">
          <Hotel className="w-4 h-4 text-pine" />
          <span>Accommodation Specifications</span>
        </h3>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-ink block mb-1">Hotel / Resort Name</label>
            <input
              value={accommodation.name}
              onChange={(e) => setAccommodation({ ...accommodation, name: e.target.value })}
              className="w-full bg-[#F2F4F3] text-xs rounded-xl px-3.5 py-2.5 outline-none text-ink"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-ink block mb-1">Property Category</label>
            <input
              value={accommodation.category}
              onChange={(e) => setAccommodation({ ...accommodation, category: e.target.value })}
              className="w-full bg-[#F2F4F3] text-xs rounded-xl px-3.5 py-2.5 outline-none text-ink"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-ink block mb-1">Amenities</label>
          <input
            value={accommodation.amenities}
            onChange={(e) => setAccommodation({ ...accommodation, amenities: e.target.value })}
            placeholder="e.g. WiFi, Infinity Pool, Gourmet Dining"
            className="w-full bg-[#F2F4F3] text-xs rounded-xl px-3.5 py-2.5 outline-none text-ink"
          />
        </div>
      </div>

      {/* 7. Publishing & Status */}
      <div className="bg-white rounded-3xl border border-[#DFE5E2] p-6 shadow-xs flex items-center justify-between">
        <div>
          <h4 className="font-bold text-sm text-ink">Publishing Visibility</h4>
          <p className="text-xs text-muted">
            {isPublished
              ? 'This package is publicly accessible and ready for customer bookings.'
              : 'Draft mode: Only administrators can preview this package.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsPublished(!isPublished)}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            isPublished
              ? 'bg-moss text-white shadow-xs'
              : 'bg-gray-200 text-ink hover:bg-gray-300'
          }`}
        >
          {isPublished ? 'Published' : 'Draft'}
        </button>
      </div>

      {/* Action Button */}
      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/admin/packages')}
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-moss hover:bg-moss/90 text-white min-w-36"
          loading={submitting}
        >
          Save Package
        </Button>
      </div>
    </form>
  );
};
