import React from 'react';
import { Users, User, ShieldCheck, Mail, Phone } from 'lucide-react';
import { Booking } from '../../types';

export interface TravellerListProps {
  booking: Booking;
}

export const TravellerList: React.FC<TravellerListProps> = ({ booking }) => {
  const primaryName =
    booking.primaryTraveller?.name || booking.leadGuest?.name || 'Primary Yatri';
  const primaryEmail = booking.primaryTraveller?.email || booking.leadGuest?.email;
  const primaryPhone = booking.primaryTraveller?.phone || booking.leadGuest?.phone;
  const primaryGender =
    booking.primaryTraveller?.gender || booking.leadGuest?.gender || 'Not specified';
  const primaryDob = booking.primaryTraveller?.dob || booking.leadGuest?.dob;

  // Age calculation from DOB if available
  const calculateAge = (dobString?: string): string | null => {
    if (!dobString) return null;
    const birthDate = new Date(dobString);
    if (isNaN(birthDate.getTime())) return null;
    const diff = Date.now() - birthDate.getTime();
    const ageDate = new Date(diff);
    return `${Math.abs(ageDate.getUTCFullYear() - 1970)} yrs`;
  };

  const primaryAge = calculateAge(primaryDob);

  const additional = booking.additionalTravellers || [];

  return (
    <div className="bg-white rounded-3xl border border-sand-dark/25 p-6 sm:p-7 shadow-card space-y-5">
      <div className="flex items-center justify-between border-b border-sand-dark/20 pb-4">
        <div>
          <h2 className="font-display font-semibold text-xl text-ink">Travellers</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Verified guest list for check-in and transit permits
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-pine font-medium">
          <ShieldCheck className="w-4 h-4" />
          <span>{booking.travellers} Registered Yatris</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Primary Traveller Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-sand/30 border border-sand-dark/30 space-y-3 relative overflow-hidden">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-pine text-sand flex items-center justify-center font-display font-bold text-base shrink-0">
                {primaryName.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-semibold text-sm text-ink">{primaryName}</h3>
                </div>
                <div className="text-xs text-stone-600 mt-0.5">
                  {primaryGender} {primaryAge ? `· ${primaryAge}` : ''}
                </div>
              </div>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-pine text-white shrink-0">
              Primary Traveller
            </span>
          </div>

          <div className="pt-2 border-t border-sand-dark/30 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-600">
            {primaryEmail && (
              <div className="flex items-center gap-1.5 truncate">
                <Mail className="w-3.5 h-3.5 text-pine shrink-0" />
                <span className="truncate">{primaryEmail}</span>
              </div>
            )}
            {primaryPhone && (
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-pine shrink-0" />
                <span>{primaryPhone}</span>
              </div>
            )}
          </div>
        </div>

        {/* Additional Travellers */}
        {additional.map((traveller, idx) => (
          <div
            key={idx}
            className="p-4 sm:p-5 rounded-2xl bg-cream/40 border border-sand-dark/20 space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-sand text-pine flex items-center justify-center font-display font-bold text-base shrink-0 border border-sand-dark/30">
                  {traveller.name?.charAt(0) || 'Y'}
                </div>
                <div>
                  <h3 className="font-display font-semibold text-sm text-ink">
                    {traveller.name || `Companion Yatri ${idx + 1}`}
                  </h3>
                  <div className="text-xs text-stone-600 mt-0.5">
                    {traveller.gender || 'Companion'} ·{' '}
                    {traveller.age ? `${traveller.age} yrs` : 'Adult'}
                  </div>
                </div>
              </div>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-sand/60 text-stone-600 shrink-0">
                Companion
              </span>
            </div>

            <div className="pt-2 border-t border-sand-dark/20 text-[11px] text-stone-500">
              Government ID verification will be completed effortlessly at hotel check-in.
            </div>
          </div>
        ))}

        {/* If travellers count is greater than (1 + additional.length), display placeholder guest summary */}
        {booking.travellers > 1 + additional.length &&
          Array.from({ length: booking.travellers - 1 - additional.length }).map((_, idx) => (
            <div
              key={`synth-${idx}`}
              className="p-4 sm:p-5 rounded-2xl bg-cream/30 border border-sand-dark/20 space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-sand text-stone-600 flex items-center justify-center font-display font-bold text-base shrink-0">
                    <User className="w-5 h-5 text-pine" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-sm text-ink">
                      Accompanying Traveller {idx + 2}
                    </h3>
                    <div className="text-xs text-stone-600 mt-0.5">
                      Included in reservation
                    </div>
                  </div>
                </div>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-sand/60 text-stone-600 shrink-0">
                  Companion
                </span>
              </div>
              <div className="pt-2 border-t border-sand-dark/20 text-[11px] text-stone-500">
                Name registered on master hotel room voucher.
              </div>
            </div>
          ))}
      </div>

      {booking.leadGuest?.specialRequests && (
        <div className="p-3.5 rounded-2xl bg-sand/20 border border-sand-dark/25 text-xs text-stone-700">
          <strong className="text-ink">Special Preferences on Record:</strong>{' '}
          {booking.leadGuest.specialRequests}
        </div>
      )}
    </div>
  );
};
