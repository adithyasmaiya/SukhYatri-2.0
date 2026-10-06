import React from 'react';
import { User, Mail, Phone, Calendar, Globe, AlertCircle } from 'lucide-react';
import { PrimaryTraveller, AdditionalTraveller } from '../../types';

export interface FormErrors {
  primaryName?: string;
  primaryEmail?: string;
  primaryPhone?: string;
  additionalTravellers?: Record<number, { name?: string; age?: string }>;
}

export interface TravellerFormProps {
  primaryTraveller: PrimaryTraveller;
  onPrimaryChange: (field: keyof PrimaryTraveller, value: string) => void;
  additionalTravellers: AdditionalTraveller[];
  onAdditionalChange: (index: number, field: keyof AdditionalTraveller, value: string | number) => void;
  totalTravellers: number;
  errors: FormErrors;
}

export const TravellerForm: React.FC<TravellerFormProps> = ({
  primaryTraveller,
  onPrimaryChange,
  additionalTravellers,
  onAdditionalChange,
  totalTravellers,
  errors,
}) => {
  const additionalCount = Math.max(0, totalTravellers - 1);

  return (
    <div className="space-y-8">
      {/* 1. Primary Traveller Section */}
      <div className="bg-white rounded-3xl border border-stonewarm p-6 sm:p-7 shadow-xs space-y-5">
        <div className="border-b border-stonewarm/70 pb-3">
          <div className="text-[11px] font-bold uppercase tracking-wider text-moss">
            Lead Guest Information
          </div>
          <h3 className="font-display text-xl font-bold text-ink mt-0.5">
            Primary Traveller (Booking Contact)
          </h3>
          <p className="text-xs text-muted mt-1">
            Trip vouchers, driver contact details, and emergency support will be dispatched to these details.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-ink">
              Full Legal Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. Ananya Sharma"
                value={primaryTraveller.name}
                onChange={(e) => onPrimaryChange('name', e.target.value)}
                className={`w-full bg-cream2/50 border rounded-2xl px-4 py-3 text-sm font-semibold text-ink outline-none transition ${
                  errors.primaryName
                    ? 'border-red-500 focus:ring-2 focus:ring-red-100'
                    : 'border-stonewarm focus:border-pine focus:ring-2 focus:ring-pine/20'
                }`}
              />
            </div>
            {errors.primaryName && (
              <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.primaryName}</span>
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-ink">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="e.g. ananya@example.com"
                value={primaryTraveller.email}
                onChange={(e) => onPrimaryChange('email', e.target.value)}
                className={`w-full bg-cream2/50 border rounded-2xl px-4 py-3 text-sm font-semibold text-ink outline-none transition ${
                  errors.primaryEmail
                    ? 'border-red-500 focus:ring-2 focus:ring-red-100'
                    : 'border-stonewarm focus:border-pine focus:ring-2 focus:ring-pine/20'
                }`}
              />
            </div>
            {errors.primaryEmail && (
              <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.primaryEmail}</span>
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-ink">
              Phone Number (WhatsApp Active) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="tel"
                placeholder="e.g. 98200 11223 or +91 9820011223"
                value={primaryTraveller.phone}
                onChange={(e) => onPrimaryChange('phone', e.target.value)}
                className={`w-full bg-cream2/50 border rounded-2xl px-4 py-3 text-sm font-semibold text-ink outline-none transition ${
                  errors.primaryPhone
                    ? 'border-red-500 focus:ring-2 focus:ring-red-100'
                    : 'border-stonewarm focus:border-pine focus:ring-2 focus:ring-pine/20'
                }`}
              />
            </div>
            {errors.primaryPhone && (
              <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.primaryPhone}</span>
              </p>
            )}
          </div>

          {/* Gender */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-ink">Gender</label>
            <select
              value={primaryTraveller.gender || 'Female'}
              onChange={(e) => onPrimaryChange('gender', e.target.value)}
              className="w-full bg-cream2/50 border border-stonewarm rounded-2xl px-4 py-3 text-sm font-semibold text-ink outline-none focus:border-pine cursor-pointer"
            >
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Non-Binary">Non-Binary</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>

          {/* Date of Birth */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-ink">Date of Birth</label>
            <input
              type="date"
              value={primaryTraveller.dob || '1995-05-15'}
              onChange={(e) => onPrimaryChange('dob', e.target.value)}
              className="w-full bg-cream2/50 border border-stonewarm rounded-2xl px-4 py-3 text-sm font-semibold text-ink outline-none focus:border-pine cursor-pointer"
            />
          </div>

          {/* Country */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-ink">Country of Residence</label>
            <input
              type="text"
              value={primaryTraveller.country || 'India'}
              onChange={(e) => onPrimaryChange('country', e.target.value)}
              className="w-full bg-cream2/50 border border-stonewarm rounded-2xl px-4 py-3 text-sm font-semibold text-ink outline-none focus:border-pine"
            />
          </div>
        </div>

        {/* Special Requests */}
        <div className="space-y-1.5 pt-2">
          <label className="block text-xs font-bold text-ink">
            Dietary or Accessibility Requests (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Jain meals, quiet room away from elevator, ground floor preferred"
            value={primaryTraveller.specialRequests || ''}
            onChange={(e) => onPrimaryChange('specialRequests', e.target.value)}
            className="w-full bg-cream2/50 border border-stonewarm rounded-2xl px-4 py-3 text-xs sm:text-sm font-medium text-ink outline-none focus:border-pine"
          />
        </div>
      </div>

      {/* 2. Additional Travellers (Dynamically generated) */}
      {additionalCount > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-moss">
                Co-Travellers
              </div>
              <h3 className="font-display text-xl font-bold text-ink mt-0.5">
                Additional Travellers ({additionalCount})
              </h3>
            </div>
            <span className="text-xs text-muted font-medium">
              Permits &amp; stay check-in requirements
            </span>
          </div>

          <div className="space-y-4">
            {Array.from({ length: additionalCount }).map((_, idx) => {
              const currentAdditional = additionalTravellers[idx] || {
                name: '',
                age: 28,
                gender: 'Female',
              };
              const fieldErrors = errors.additionalTravellers?.[idx];

              return (
                <div
                  key={idx}
                  className="bg-white rounded-3xl border border-stonewarm p-5 sm:p-6 shadow-xs space-y-4"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-stonewarm/60">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-pine">
                      Traveller {idx + 2}
                    </span>
                    <span className="text-[11px] text-muted font-semibold">
                      Guest #{idx + 2} of {totalTravellers}
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-3.5">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-ink">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Guest legal name"
                        value={currentAdditional.name || ''}
                        onChange={(e) => onAdditionalChange(idx, 'name', e.target.value)}
                        className={`w-full bg-cream2/50 border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-ink outline-none transition ${
                          fieldErrors?.name
                            ? 'border-red-500 focus:ring-2 focus:ring-red-100'
                            : 'border-stonewarm focus:border-pine'
                        }`}
                      />
                      {fieldErrors?.name && (
                        <p className="text-[11px] text-red-600 font-medium">
                          {fieldErrors.name}
                        </p>
                      )}
                    </div>

                    {/* Age */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-ink">
                        Age <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="120"
                        placeholder="Years"
                        value={currentAdditional.age || ''}
                        onChange={(e) => onAdditionalChange(idx, 'age', Number(e.target.value))}
                        className={`w-full bg-cream2/50 border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-ink outline-none transition ${
                          fieldErrors?.age
                            ? 'border-red-500 focus:ring-2 focus:ring-red-100'
                            : 'border-stonewarm focus:border-pine'
                        }`}
                      />
                      {fieldErrors?.age && (
                        <p className="text-[11px] text-red-600 font-medium">{fieldErrors.age}</p>
                      )}
                    </div>

                    {/* Gender */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-ink">Gender</label>
                      <select
                        value={currentAdditional.gender || 'Female'}
                        onChange={(e) => onAdditionalChange(idx, 'gender', e.target.value)}
                        className="w-full bg-cream2/50 border border-stonewarm rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-ink outline-none focus:border-pine cursor-pointer"
                      >
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Non-Binary">Non-Binary</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
