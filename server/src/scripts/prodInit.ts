/**
 * SukhYatri 2.0 — Safe Production Database Initializer
 *
 * SAFETY GUARANTEES:
 * 1. NEVER drops collections or deletes existing records.
 * 2. ONLY provisions the designated Administrator if no admin exists.
 * 3. Populates initial official catalog (destinations & trips) if empty.
 * 4. Populates launch coupons (SUKH10, WELCOME500) if empty with 0 used count.
 * 5. Builds all required unique and query indexes.
 * 6. ZERO fake test users, ZERO fake test bookings, ZERO fake test reviews.
 */

import bcrypt from 'bcryptjs';
import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { ENV } from '../config/env.js';
import { User } from '../models/User.js';
import { Destination } from '../models/Destination.js';
import { Trip } from '../models/Trip.js';
import { Coupon } from '../models/Coupon.js';
import { Booking } from '../models/Booking.js';
import { Payment } from '../models/Payment.js';
import { Review } from '../models/Review.js';
import { SEED_DESTINATIONS, SEED_TRIPS } from '../data/seedData.js';

export async function runProductionInit(autoDisconnect: boolean = true): Promise<void> {
  console.log('\n======================================================');
  console.log('  SukhYatri 2.0 — Safe Production Database Init');
  console.log('======================================================\n');

  await connectDatabase();

  try {
    // 1. Build and sync all MongoDB collection indexes
    console.log('[Prod-Init] Synchronizing database indexes...');
    await Promise.all([
      User.syncIndexes(),
      Destination.syncIndexes(),
      Trip.syncIndexes(),
      Coupon.syncIndexes(),
      Booking.syncIndexes(),
      Payment.syncIndexes(),
      Review.syncIndexes(),
    ]);
    console.log('[Prod-Init] Indexes synchronized successfully.');

    // 2. Ensure Production Admin exists
    const adminEmail = ENV.ADMIN_EMAIL.toLowerCase();
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      console.log(`[Prod-Init] Provisioning initial administrator: ${adminEmail}`);
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(ENV.ADMIN_PASSWORD, salt);

      await User.create({
        name: ENV.ADMIN_NAME,
        email: adminEmail,
        phone: '+91 99999 00000',
        passwordHash,
        role: 'admin',
        emailVerified: true,
        tier: 'Platinum',
        sukhCoins: 0,
      });
      console.log('[Prod-Init] Production administrator account initialized.');
    } else {
      console.log(`[Prod-Init] Administrator (${adminEmail}) already exists. Retaining existing credentials.`);
    }

    // 3. Populate Destinations if catalog is empty
    const destCount = await Destination.countDocuments();
    if (destCount === 0) {
      console.log(`[Prod-Init] Populating ${SEED_DESTINATIONS.length} official launch destinations...`);
      const destDocs = SEED_DESTINATIONS.map((d) => ({
        ...d,
        isPublished: true,
      }));
      await Destination.insertMany(destDocs);
      console.log('[Prod-Init] Destinations catalog populated.');
    } else {
      console.log(`[Prod-Init] Destinations catalog already contains ${destCount} destinations. Skipping.`);
    }

    // 4. Populate Trips if catalog is empty
    const tripCount = await Trip.countDocuments();
    if (tripCount === 0) {
      console.log(`[Prod-Init] Populating ${SEED_TRIPS.length} official curated packages...`);
      const tripDocs = SEED_TRIPS.map((t) => ({
        ...t,
        isPublished: true,
      }));
      await Trip.insertMany(tripDocs);
      console.log('[Prod-Init] Curated packages populated.');
    } else {
      console.log(`[Prod-Init] Trips catalog already contains ${tripCount} packages. Skipping.`);
    }

    // 5. Populate Launch Coupons if empty
    const couponCount = await Coupon.countDocuments();
    if (couponCount === 0) {
      console.log('[Prod-Init] Populating launch promotional vouchers...');
      const launchCoupons = [
        {
          code: 'SUKH10',
          discountType: 'percentage',
          discountValue: 10,
          maxDiscount: 15000,
          minimumBookingAmount: 25000,
          usageLimit: 500,
          usedCount: 0,
          validFrom: new Date(),
          validUntil: new Date('2027-12-31'),
          isActive: true,
        },
        {
          code: 'WELCOME500',
          discountType: 'fixed',
          discountValue: 500,
          minimumBookingAmount: 5000,
          usageLimit: 1000,
          usedCount: 0,
          validFrom: new Date(),
          validUntil: new Date('2027-12-31'),
          isActive: true,
        },
      ];
      await Coupon.insertMany(launchCoupons);
      console.log('[Prod-Init] Launch coupons populated with zero initial used count.');
    } else {
      console.log(`[Prod-Init] Coupons collection already contains ${couponCount} records. Skipping.`);
    }

    console.log('\n[Prod-Init] SUCCESS: Production database initialization complete with zero test data.');
  } catch (err: any) {
    console.error('[Prod-Init] FATAL ERROR during initialization:', err);
    throw err;
  } finally {
    if (autoDisconnect) {
      await disconnectDatabase();
    }
  }
}

// Allow direct CLI execution: node dist/scripts/prodInit.js
const isDirectCli = process.argv[1]?.endsWith('prodInit.js') || process.argv[1]?.endsWith('prodInit.ts');
if (isDirectCli) {
  runProductionInit(true)
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
