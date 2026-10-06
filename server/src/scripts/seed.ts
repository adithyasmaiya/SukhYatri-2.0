import bcrypt from 'bcryptjs';
import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { ENV } from '../config/env.js';
import { User } from '../models/User.js';
import { Destination } from '../models/Destination.js';
import { Trip } from '../models/Trip.js';
import { Coupon } from '../models/Coupon.js';
import { Booking } from '../models/Booking.js';
import { Review } from '../models/Review.js';

// Seed data definitions
import { SEED_DESTINATIONS, SEED_TRIPS, SeedDestination, SeedTrip } from '../data/seedData.js';

export async function runSeed(autoDisconnect: boolean = true): Promise<void> {
  if (ENV.NODE_ENV === 'production') {
    throw new Error(
      '[CRITICAL SAFETY ERROR] Destructive database wipe (runSeed) is strictly forbidden in production! Use "npm run db:init:prod" for safe production initialization.'
    );
  }

  console.log('--- Starting SukhYatri 2.0 Database Seeding ---');
  await connectDatabase();

  try {
    // 1. Clean existing collections
    console.log('[Seed] Cleaning collections...');
    await Promise.all([
      User.deleteMany({}),
      Destination.deleteMany({}),
      Trip.deleteMany({}),
      Coupon.deleteMany({}),
      Booking.deleteMany({}),
      Review.deleteMany({}),
    ]);

    // 2. Seed Users
    console.log('[Seed] Seeding users...');
    const adminSalt = await bcrypt.genSalt(10);
    const adminHash = await bcrypt.hash(ENV.ADMIN_PASSWORD, adminSalt);

    const adminUser = await User.create({
      name: ENV.ADMIN_NAME,
      email: ENV.ADMIN_EMAIL.toLowerCase(),
      phone: '+91 99999 00000',
      passwordHash: adminHash,
      role: 'admin',
      emailVerified: true,
      tier: 'Gold',
      sukhCoins: 10000,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    });

    const userSalt = await bcrypt.genSalt(10);
    const userHash = await bcrypt.hash('Password123!', userSalt);

    const testUser = await User.create({
      name: 'Ananya Sharma',
      email: 'ananya@example.com',
      phone: '+91 98200 11223',
      passwordHash: userHash,
      role: 'user',
      emailVerified: true,
      tier: 'Gold',
      sukhCoins: 2450,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
    });

    const secondUser = await User.create({
      name: 'Rohan Mehta',
      email: 'rohan.mehta@example.com',
      phone: '+91 98111 22334',
      passwordHash: userHash,
      role: 'user',
      emailVerified: true,
      tier: 'Silver',
      sukhCoins: 500,
    });

    console.log(`[Seed] Seeded 3 users (Admin: ${adminUser.email}, Test: ${testUser.email}, Other: ${secondUser.email})`);

    // 3. Seed Destinations
    console.log('[Seed] Seeding destinations...');
    const destinationDocs = SEED_DESTINATIONS.map((d: SeedDestination) => ({
      name: d.name,
      slug: d.slug.toLowerCase(),
      state: d.state,
      description: d.description,
      shortDescription: d.shortDescription || '',
      heroImage: d.heroImage,
      gallery: d.gallery || [d.heroImage],
      bestTimeToVisit: d.bestTimeToVisit || 'October – March',
      recommendedDuration: d.recommendedDuration || '4–6 Days',
      travelHighlights: d.travelHighlights || [],
      experiences: (d.experiences || []).map((exp) => ({
        title: exp.title || 'Curated Experience',
        description: exp.description || '',
        image: exp.image || '',
      })),
      faqs: (d.faqs || []).map((faq) => ({
        question: faq.question,
        answer: faq.answer,
      })),
      isPublished: true,
    }));

    const createdDestinations = await Destination.insertMany(destinationDocs);
    console.log(`[Seed] Seeded ${createdDestinations.length} destinations.`);

    // 4. Seed Trips / Packages (12+ packages)
    console.log('[Seed] Seeding trips / packages...');
    const tripDocs = SEED_TRIPS.map((p: SeedTrip) => {
      const styles = Array.isArray(p.travelStyle) ? p.travelStyle : [p.travelStyle];
      return {
        title: p.title,
        slug: p.slug.toLowerCase(),
        destinationName: p.destinationName,
        state: p.state || 'India',
        description: p.description,
        shortDescription: p.shortDescription || '',
        images: p.images && p.images.length > 0 ? p.images : [],
        duration: p.duration || `${p.days} Days / ${p.nights} Nights`,
        days: p.days || 6,
        nights: p.nights || 5,
        rating: p.rating || 4.8,
        reviewCount: p.reviewCount || 40,
        price: p.price,
        originalPrice: p.originalPrice || Math.round(p.price * 1.15),
        discount: p.discount || 10,
        travelStyle: styles,
        themes: p.themes || [],
        highlights: p.highlights || [],
        itinerary: (p.itinerary || []).map((item) => ({
          day: item.day,
          title: item.title,
          description: item.description,
          activities: item.activities || [],
          location: item.location || '',
          image: item.image || '',
        })),
        inclusions: p.inclusions || [],
        exclusions: p.exclusions || [],
        accommodation: {
          tier: p.accommodation?.tier || 'Heritage Boutique & Plantation Stay',
          hotelName: p.accommodation?.hotelName || '',
          highlights: p.accommodation?.highlights || [],
        },
        faqs: (p.faqs || []).map((f) => ({
          question: f.question,
          answer: f.answer,
        })),
        isPublished: true,
      };
    });

    const createdTrips = await Trip.insertMany(tripDocs);
    console.log(`[Seed] Seeded ${createdTrips.length} curated trips.`);

    // 5. Seed Coupons
    console.log('[Seed] Seeding promo coupons...');
    const couponDocs = [
      {
        code: 'SUKH10',
        discountType: 'percentage',
        discountValue: 10,
        maxDiscount: 15000,
        minimumBookingAmount: 25000,
        usageLimit: 500,
        usedCount: 42,
        validFrom: new Date('2025-01-01'),
        validUntil: new Date('2027-12-31'),
        isActive: true,
      },
      {
        code: 'WELCOME500',
        discountType: 'fixed',
        discountValue: 500,
        minimumBookingAmount: 5000,
        usageLimit: 1000,
        usedCount: 120,
        validFrom: new Date('2025-01-01'),
        validUntil: new Date('2027-12-31'),
        isActive: true,
      },
      {
        code: 'SUKH15',
        discountType: 'percentage',
        discountValue: 15,
        maxDiscount: 20000,
        minimumBookingAmount: 40000,
        usageLimit: 200,
        usedCount: 15,
        validFrom: new Date('2025-01-01'),
        validUntil: new Date('2027-12-31'),
        isActive: true,
      },
    ];

    await Coupon.insertMany(couponDocs);
    console.log(`[Seed] Seeded ${couponDocs.length} coupons.`);

    // 6. Seed Sample Bookings (Upcoming, Completed, Cancelled for testUser, and 1 for secondUser)
    console.log('[Seed] Seeding sample user bookings...');
    const keralaTrip = createdTrips.find((t) => t.slug.includes('kerala')) || createdTrips[0];
    const rajasthanTrip = createdTrips.find((t) => t.slug.includes('rajasthan')) || createdTrips[1];
    const coorgTrip = createdTrips.find((t) => t.slug.includes('coorg')) || createdTrips[2];
    const andamanTrip = createdTrips.find((t) => t.slug.includes('andaman')) || createdTrips[3];

    const bookingsToSeed = [
      // Booking 1: Upcoming Confirmed (Kerala)
      {
        bookingId: 'SKY-2026-8F42K',
        userId: testUser._id,
        tripId: keralaTrip._id,
        tripSnapshot: {
          id: keralaTrip.slug,
          title: keralaTrip.title,
          image: keralaTrip.images[0],
          destination: keralaTrip.destinationName,
          duration: keralaTrip.duration,
          price: keralaTrip.price,
        },
        destinationName: keralaTrip.destinationName,
        travelDate: '2026-10-24',
        endDate: '2026-10-29',
        duration: keralaTrip.duration,
        travellers: 2,
        adults: 2,
        children: 0,
        rooms: 1,
        roomCategory: 'Deluxe',
        primaryTraveller: {
          name: 'Ananya Sharma',
          email: 'ananya@example.com',
          phone: '+91 98200 11223',
          gender: 'Female',
          dob: '1995-05-15',
          specialRequests: 'High-floor quiet room away from elevator, Jain meals preferred.',
        },
        additionalTravellers: [{ name: 'Rohan Sharma', age: 31, gender: 'Male' }],
        pricing: {
          baseAmount: 97000,
          travellerCount: 2,
          subtotal: 97000,
          discount: 9700,
          couponCode: 'SUKH10',
          taxes: 4365,
          totalAmount: 91665,
          currency: 'INR',
        },
        paymentStatus: 'paid',
        paymentMethod: 'upi',
        bookingStatus: 'confirmed',
        refundStatus: 'not_applicable',
      },
      // Booking 2: Upcoming Confirmed (Rajasthan)
      {
        bookingId: 'SKY-2026-3N89P',
        userId: testUser._id,
        tripId: rajasthanTrip._id,
        tripSnapshot: {
          id: rajasthanTrip.slug,
          title: rajasthanTrip.title,
          image: rajasthanTrip.images[0],
          destination: rajasthanTrip.destinationName,
          duration: rajasthanTrip.duration,
          price: rajasthanTrip.price,
        },
        destinationName: rajasthanTrip.destinationName,
        travelDate: '2026-11-20',
        endDate: '2026-11-26',
        duration: rajasthanTrip.duration,
        travellers: 2,
        adults: 2,
        children: 0,
        rooms: 1,
        roomCategory: 'Luxury',
        primaryTraveller: {
          name: 'Ananya Sharma',
          email: 'ananya@example.com',
          phone: '+91 98200 11223',
          gender: 'Female',
          dob: '1995-05-15',
        },
        additionalTravellers: [{ name: 'Sunita Sharma', age: 58, gender: 'Female' }],
        pricing: {
          baseAmount: 112800,
          travellerCount: 2,
          subtotal: 112800,
          discount: 500,
          couponCode: 'WELCOME500',
          taxes: 5615,
          totalAmount: 117915,
          currency: 'INR',
        },
        paymentStatus: 'paid',
        paymentMethod: 'card',
        bookingStatus: 'confirmed',
        refundStatus: 'not_applicable',
      },
      // Booking 3: Completed Trip with Review (Coorg)
      {
        bookingId: 'SKY-2026-1M72Q',
        userId: testUser._id,
        tripId: coorgTrip._id,
        tripSnapshot: {
          id: coorgTrip.slug,
          title: coorgTrip.title,
          image: coorgTrip.images[0],
          destination: coorgTrip.destinationName,
          duration: coorgTrip.duration,
          price: coorgTrip.price,
        },
        destinationName: coorgTrip.destinationName,
        travelDate: '2026-08-12',
        endDate: '2026-08-16',
        duration: coorgTrip.duration,
        travellers: 2,
        adults: 2,
        children: 0,
        rooms: 1,
        roomCategory: 'Estate Suite',
        primaryTraveller: {
          name: 'Ananya Sharma',
          email: 'ananya@example.com',
          phone: '+91 98200 11223',
          gender: 'Female',
        },
        additionalTravellers: [{ name: 'Rohan Sharma', age: 31, gender: 'Male' }],
        pricing: {
          baseAmount: 64000,
          travellerCount: 2,
          subtotal: 64000,
          discount: 0,
          taxes: 3200,
          totalAmount: 67200,
          currency: 'INR',
        },
        paymentStatus: 'paid',
        paymentMethod: 'upi',
        bookingStatus: 'completed',
        refundStatus: 'not_applicable',
        reviewSubmitted: true,
        review: {
          rating: 5,
          title: 'Unbelievable coffee plantation peace & warm hosts',
          comment: 'Waking up to birdsong and fresh arabica roast in the misty Coorg hills was pure magic. Chauffeur Senthil was extremely polite and careful on mountain hairpins.',
          createdAt: '2026-08-18',
        },
      },
      // Booking 4: Cancelled Trip (with refund calculation)
      {
        bookingId: 'SKY-2026-9C41L',
        userId: testUser._id,
        tripId: keralaTrip._id,
        tripSnapshot: {
          id: keralaTrip.slug,
          title: keralaTrip.title,
          image: keralaTrip.images[0],
          destination: keralaTrip.destinationName,
          duration: keralaTrip.duration,
          price: keralaTrip.price,
        },
        destinationName: keralaTrip.destinationName,
        travelDate: '2026-09-05',
        endDate: '2026-09-10',
        duration: keralaTrip.duration,
        travellers: 2,
        adults: 2,
        children: 0,
        rooms: 1,
        roomCategory: 'Deluxe',
        primaryTraveller: {
          name: 'Ananya Sharma',
          email: 'ananya@example.com',
          phone: '+91 98200 11223',
          gender: 'Female',
        },
        additionalTravellers: [],
        pricing: {
          baseAmount: 97000,
          travellerCount: 2,
          subtotal: 97000,
          discount: 0,
          taxes: 4850,
          totalAmount: 101850,
          currency: 'INR',
        },
        paymentStatus: 'refunded',
        paymentMethod: 'card',
        bookingStatus: 'cancelled',
        refundStatus: 'refunded',
        cancellation: {
          cancelledAt: new Date('2026-08-20'),
          reason: 'Change of plans: Office schedule conflict',
          cancellationFee: 5092,
          refundAmount: 96758,
          policyTier: '15+ Days Before Travel (95% refund)',
        },
      },
      // Booking 5: Third-party user booking (Isolates Rohan Mehta's data from Ananya)
      {
        bookingId: 'SKY-2026-OTHER1',
        userId: secondUser._id,
        tripId: andamanTrip._id,
        tripSnapshot: {
          id: andamanTrip.slug,
          title: andamanTrip.title,
          image: andamanTrip.images[0],
          destination: andamanTrip.destinationName,
          duration: andamanTrip.duration,
          price: andamanTrip.price,
        },
        destinationName: andamanTrip.destinationName,
        travelDate: '2026-11-12',
        endDate: '2026-11-17',
        duration: andamanTrip.duration,
        travellers: 2,
        adults: 2,
        children: 0,
        rooms: 1,
        roomCategory: 'Beach Villa',
        primaryTraveller: {
          name: 'Rohan Mehta',
          email: 'rohan.mehta@example.com',
          phone: '+91 98111 22334',
          gender: 'Male',
        },
        additionalTravellers: [],
        pricing: {
          baseAmount: 85000,
          travellerCount: 2,
          subtotal: 85000,
          discount: 0,
          taxes: 4250,
          totalAmount: 89250,
          currency: 'INR',
        },
        paymentStatus: 'paid',
        paymentMethod: 'card',
        bookingStatus: 'confirmed',
        refundStatus: 'not_applicable',
      },
    ];

    const createdBookings = await Booking.insertMany(bookingsToSeed);
    console.log(`[Seed] Seeded ${createdBookings.length} bookings.`);

    // 7. Seed Sample Reviews
    console.log('[Seed] Seeding sample verified reviews...');
    const reviewDocs = [
      {
        userId: testUser._id,
        userName: testUser.name,
        userAvatar: testUser.avatar,
        tripId: coorgTrip._id,
        tripTitle: coorgTrip.title,
        bookingId: 'SKY-2026-1M72Q',
        rating: 5,
        title: 'Unbelievable coffee plantation peace & warm hosts',
        comment: 'Waking up to birdsong and fresh arabica roast in the misty Coorg hills was pure magic. Chauffeur Senthil was extremely polite and careful on mountain hairpins.',
        isPublished: true,
      },
    ];

    await Review.insertMany(reviewDocs);
    console.log(`[Seed] Seeded ${reviewDocs.length} reviews.`);

    console.log('\n--- SukhYatri 2.0 Database Seeding Completed Successfully! ---');
  } catch (err) {
    console.error('[Seed] Error during seeding:', err);
    throw err;
  } finally {
    if (autoDisconnect) {
      await disconnectDatabase();
    }
  }
}

// Direct execution guard
if (process.argv[1]?.includes('seed')) {
  runSeed(true)
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
