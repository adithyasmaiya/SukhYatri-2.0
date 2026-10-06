import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  ExternalLink,
  Clock,
  Compass,
  Sparkles,
  HelpCircle,
  Image as ImageIcon,
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { toSlug, formatDate } from '../../utils/format';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';
import { ImageGalleryManager } from '../../components/admin/ImageGalleryManager';

export const AdminDestinationFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [state, setState] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [heroImage, setHeroImage] = useState(
    'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80'
  );
  const [gallery, setGallery] = useState<string[]>([
    'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=800&q=80',
  ]);
  const [bestTimeToVisit, setBestTimeToVisit] = useState('October to March');
  const [recommendedDuration, setRecommendedDuration] = useState('5 to 7 Days');

  // Highlights
  const [travelHighlights, setTravelHighlights] = useState<string[]>([
    'Tranquil houseboat cruising through private backwater lagoons',
    'Sunset tea estate tastings in cool hill station retreats',
    'Authentic Kathakali classical dance performances',
  ]);

  // Experiences (Title, Description, Image)
  const [experiences, setExperiences] = useState<any[]>([
    {
      title: 'Backwater Slow Cruise',
      description: 'Spend an unhurried afternoon drifting past lush coconut groves on an eco-friendly private houseboat.',
      image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Artisanal Spice Garden Walk',
      description: 'Walk through organic spice gardens with experienced local botanists tasting fresh cardamom and pepper.',
      image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=600&q=80',
    },
  ]);

  // FAQs
  const [faqs, setFaqs] = useState<any[]>([
    {
      question: 'What is the best way to get around the region?',
      answer: 'SukhYatri pairs each group with a dedicated private air-conditioned vehicle and an experienced local chauffeur.',
    },
  ]);

  // Visibility
  const [isPublished, setIsPublished] = useState(true);

  useEffect(() => {
    if (isEdit && id) {
      adminService
        .getDestinationById(id)
        .then((dest) => {
          if (dest) {
            setName(dest.name || '');
            setSlug(dest.slug || '');
            setState(dest.state || '');
            setShortDescription(dest.shortDescription || '');
            setDescription(dest.description || '');
            if (dest.heroImage) setHeroImage(dest.heroImage);
            if (dest.gallery && dest.gallery.length) setGallery(dest.gallery);
            setBestTimeToVisit(dest.bestTimeToVisit || 'October to March');
            setRecommendedDuration(dest.recommendedDuration || '5 to 7 Days');
            if (dest.travelHighlights && dest.travelHighlights.length)
              setTravelHighlights(dest.travelHighlights);
            if (dest.experiences && dest.experiences.length) setExperiences(dest.experiences);
            if (dest.faqs && dest.faqs.length) setFaqs(dest.faqs);
            setIsPublished(dest.isPublished !== undefined ? dest.isPublished : true);
            setLastUpdated(dest.updatedAt || dest.createdAt || null);
          }
        })
        .catch((err) => {
          toast(err.message || 'Error loading destination', 'error');
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleNameBlur = () => {
    if (!slug && name) {
      setSlug(toSlug(name));
    }
  };

  // Highlights handlers
  const addHighlight = () => setTravelHighlights([...travelHighlights, '']);
  const updateHighlight = (i: number, val: string) => {
    const arr = [...travelHighlights];
    arr[i] = val;
    setTravelHighlights(arr);
  };
  const removeHighlight = (i: number) =>
    setTravelHighlights(travelHighlights.filter((_, idx) => idx !== i));

  // Experiences handlers
  const addExperience = () =>
    setExperiences([
      ...experiences,
      {
        title: 'New Experience',
        description: 'Describe this special moment for travelers.',
        image: heroImage,
      },
    ]);
  const updateExperience = (i: number, field: string, val: string) => {
    const arr = [...experiences];
    arr[i] = { ...arr[i], [field]: val };
    setExperiences(arr);
  };
  const removeExperience = (i: number) =>
    setExperiences(experiences.filter((_, idx) => idx !== i));

  // FAQs handlers
  const addFaq = () => setFaqs([...faqs, { question: '', answer: '' }]);
  const updateFaq = (i: number, field: string, val: string) => {
    const arr = [...faqs];
    arr[i] = { ...arr[i], [field]: val };
    setFaqs(arr);
  };
  const removeFaq = (i: number) => setFaqs(faqs.filter((_, idx) => idx !== i));

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Destination name is required';
    if (!slug.trim()) newErrors.slug = 'Slug is required';
    if (!state.trim()) newErrors.state = 'State is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!heroImage.trim()) newErrors.heroImage = 'Hero image URL is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast('Please correct the validation errors', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        name: name.trim(),
        slug: slug.trim().toLowerCase(),
        state: state.trim(),
        shortDescription: shortDescription.trim() || description.slice(0, 150),
        description: description.trim(),
        heroImage: heroImage.trim(),
        gallery: gallery.filter((g) => g.trim()),
        bestTimeToVisit: bestTimeToVisit.trim(),
        recommendedDuration: recommendedDuration.trim(),
        travelHighlights: travelHighlights.filter((h) => h.trim()),
        experiences: experiences.filter((exp) => exp.title.trim()),
        faqs: faqs.filter((f) => f.question.trim()),
        isPublished,
      };

      if (isEdit && id) {
        await adminService.updateDestination(id, payload);
        toast('Destination updated successfully', 'success');
      } else {
        await adminService.createDestination(payload);
        toast('Destination created successfully', 'success');
      }
      navigate('/admin/destinations');
    } catch (err: any) {
      toast(err.message || 'Error saving destination', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-muted">
        <div className="w-8 h-8 border-4 border-moss border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs">Loading destination data…</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/destinations"
            className="w-9 h-9 rounded-xl bg-white border border-[#DFE5E2] text-ink flex items-center justify-center hover:bg-[#F2F4F3] transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="font-display text-2xl font-bold text-ink">
              {isEdit ? 'Edit Destination' : 'Create New Destination'}
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
              to={`/destination/${slug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#DFE5E2] bg-white text-xs font-semibold text-ink hover:bg-[#F2F4F3] transition"
            >
              <ExternalLink className="w-3.5 h-3.5 text-muted" />
              <span>Preview Guide</span>
            </Link>
          )}

          <Button
            type="submit"
            className="bg-moss hover:bg-moss/90 text-white flex items-center gap-1.5"
            loading={submitting}
          >
            <Save className="w-4 h-4" />
            <span>Save Destination</span>
          </Button>
        </div>
      </div>

      {/* 1. Basic Info */}
      <div className="bg-white rounded-3xl border border-[#DFE5E2] p-6 shadow-xs space-y-4">
        <h3 className="font-display text-base font-bold text-ink flex items-center gap-2">
          <Compass className="w-4 h-4 text-moss" />
          <span>Regional Identity</span>
        </h3>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold text-ink block mb-1">
              Destination Name <span className="text-clay">*</span>
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={handleNameBlur}
              placeholder="e.g. Kerala"
              className={`w-full bg-[#F2F4F3] text-xs font-medium rounded-xl px-3.5 py-2.5 outline-none border text-ink ${
                errors.name ? 'border-clay' : 'border-transparent focus:border-moss/40'
              }`}
            />
            {errors.name && <span className="text-[10.5px] text-clay mt-1 block">{errors.name}</span>}
          </div>

          <div>
            <label className="text-xs font-bold text-ink block mb-1">
              URL Slug <span className="text-clay">*</span>
            </label>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. kerala"
              className={`w-full bg-[#F2F4F3] text-xs font-medium rounded-xl px-3.5 py-2.5 outline-none border text-ink ${
                errors.slug ? 'border-clay' : 'border-transparent focus:border-moss/40'
              }`}
            />
            {errors.slug && <span className="text-[10.5px] text-clay mt-1 block">{errors.slug}</span>}
          </div>

          <div>
            <label className="text-xs font-bold text-ink block mb-1">
              State <span className="text-clay">*</span>
            </label>
            <input
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="e.g. Kerala, India"
              className={`w-full bg-[#F2F4F3] text-xs font-medium rounded-xl px-3.5 py-2.5 outline-none border text-ink ${
                errors.state ? 'border-clay' : 'border-transparent focus:border-moss/40'
              }`}
            />
            {errors.state && <span className="text-[10.5px] text-clay mt-1 block">{errors.state}</span>}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-ink block mb-1">Best Time to Visit</label>
            <input
              value={bestTimeToVisit}
              onChange={(e) => setBestTimeToVisit(e.target.value)}
              placeholder="e.g. October to March"
              className="w-full bg-[#F2F4F3] text-xs font-medium rounded-xl px-3.5 py-2.5 outline-none border border-transparent focus:border-moss/40 text-ink"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-ink block mb-1">Recommended Duration</label>
            <input
              value={recommendedDuration}
              onChange={(e) => setRecommendedDuration(e.target.value)}
              placeholder="e.g. 5 to 7 Days"
              className="w-full bg-[#F2F4F3] text-xs font-medium rounded-xl px-3.5 py-2.5 outline-none border border-transparent focus:border-moss/40 text-ink"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-ink block mb-1">Short Teaser Summary</label>
          <input
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            placeholder="A picturesque overview that welcomes travelers to this destination..."
            className="w-full bg-[#F2F4F3] text-xs font-medium rounded-xl px-3.5 py-2.5 outline-none border border-transparent focus:border-moss/40 text-ink"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-ink block mb-1">
            Full Destination Guide Description <span className="text-clay">*</span>
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Deep cultural narrative, topography, history, and seasonal rhythms..."
            className={`w-full bg-[#F2F4F3] text-xs font-medium rounded-xl p-3 outline-none border text-ink ${
              errors.description ? 'border-clay' : 'border-transparent focus:border-moss/40'
            }`}
          />
          {errors.description && (
            <span className="text-[10.5px] text-clay mt-1 block">{errors.description}</span>
          )}
        </div>
      </div>

      {/* 2. Visual Media */}
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
          title="Destination Hero Cover & Gallery"
        />
      </div>

      {/* 3. Travel Highlights */}
      <div className="bg-white rounded-3xl border border-[#DFE5E2] p-6 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-sm text-ink flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-moss" />
            <span>Key Travel Highlights</span>
          </h4>
          <button
            type="button"
            onClick={addHighlight}
            className="text-xs font-bold text-moss hover:underline flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Add Highlight
          </button>
        </div>

        <div className="space-y-2">
          {travelHighlights.map((hl, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                value={hl}
                onChange={(e) => updateHighlight(idx, e.target.value)}
                className="flex-1 bg-[#F2F4F3] text-xs rounded-xl px-3 py-2 outline-none border border-transparent focus:border-moss/40 text-ink"
              />
              <button
                type="button"
                onClick={() => removeHighlight(idx)}
                className="text-muted hover:text-clay p-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Signature Experiences */}
      <div className="bg-white rounded-3xl border border-[#DFE5E2] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-base font-bold text-ink">Signature Experiences</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addExperience}
            className="flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Experience</span>
          </Button>
        </div>

        <div className="space-y-3">
          {experiences.map((exp, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl border border-[#E5EAE8] bg-[#FBFDFB] space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-moss">Experience #{idx + 1}</span>
                <button
                  type="button"
                  onClick={() => removeExperience(idx)}
                  className="text-clay hover:bg-clay/10 p-1 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-muted block mb-0.5">Title</label>
                  <input
                    value={exp.title}
                    onChange={(e) => updateExperience(idx, 'title', e.target.value)}
                    className="w-full bg-white text-xs font-semibold rounded-xl px-3 py-2 border border-[#DFE5E2] text-ink outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-muted block mb-0.5">Image URL</label>
                  <input
                    value={exp.image}
                    onChange={(e) => updateExperience(idx, 'image', e.target.value)}
                    className="w-full bg-white text-xs rounded-xl px-3 py-2 border border-[#DFE5E2] text-ink outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-muted block mb-0.5">Description</label>
                <textarea
                  rows={2}
                  value={exp.description}
                  onChange={(e) => updateExperience(idx, 'description', e.target.value)}
                  className="w-full bg-white text-xs rounded-xl p-2.5 border border-[#DFE5E2] text-ink outline-none"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. FAQs */}
      <div className="bg-white rounded-3xl border border-[#DFE5E2] p-6 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-sm text-ink flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-pine" />
            <span>Destination FAQs</span>
          </h4>
          <button
            type="button"
            onClick={addFaq}
            className="text-xs font-bold text-moss hover:underline flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Add FAQ
          </button>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="p-3 bg-[#F9FAF9] rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <input
                  value={faq.question}
                  onChange={(e) => updateFaq(idx, 'question', e.target.value)}
                  placeholder="Question..."
                  className="w-full bg-white text-xs font-semibold rounded-lg px-3 py-1.5 border border-[#DFE5E2] text-ink outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeFaq(idx)}
                  className="text-muted hover:text-clay p-1 ml-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <textarea
                rows={2}
                value={faq.answer}
                onChange={(e) => updateFaq(idx, 'answer', e.target.value)}
                placeholder="Answer..."
                className="w-full bg-white text-xs rounded-lg p-2 border border-[#DFE5E2] text-ink outline-none"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 6. Publishing */}
      <div className="bg-white rounded-3xl border border-[#DFE5E2] p-6 shadow-xs flex items-center justify-between">
        <div>
          <h4 className="font-bold text-sm text-ink">Publishing Visibility</h4>
          <p className="text-xs text-muted">
            {isPublished
              ? 'This destination guide is publicly available to all travelers on SukhYatri.'
              : 'Draft mode: Only visible to administrators.'}
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

      {/* Submit Button */}
      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/admin/destinations')}
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-moss hover:bg-moss/90 text-white min-w-36"
          loading={submitting}
        >
          Save Destination
        </Button>
      </div>
    </form>
  );
};
