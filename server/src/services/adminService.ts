import mongoose from 'mongoose';
import { User, IUser } from '../models/User.js';
import { Trip, ITrip } from '../models/Trip.js';
import { Destination, IDestination } from '../models/Destination.js';
import { Booking, IBooking } from '../models/Booking.js';
import { Payment, IPayment } from '../models/Payment.js';
import { Coupon, ICoupon } from '../models/Coupon.js';
import { Review, IReview } from '../models/Review.js';
import { AuditLog } from '../models/AuditLog.js';
import { Setting } from '../models/Setting.js';
import { pricingService } from './pricingService.js';
import { emailService } from './emailService.js';
import { isValidImageUrl, sanitizeImageGallery } from '../utils/mediaValidator.js';

export class AdminService {
  /**
   * Helper to write audit logs
   */
  async logAudit(
    adminUserId: string,
    action: string,
    entityType: 'package' | 'destination' | 'coupon' | 'review' | 'booking' | 'user' | 'payment' | 'settings',
    entityId: string,
    metadata: Record<string, any> = {}
  ): Promise<void> {
    try {
      const admin = await User.findById(adminUserId).select('email').lean();
      await AuditLog.create({
        adminUserId,
        adminEmail: admin?.email || '',
        action,
        entityType,
        entityId: entityId.toString(),
        timestamp: new Date(),
        metadata,
      });
    } catch (e) {
      console.warn('[AdminService] Non-critical audit log creation failure:', e);
    }
  }

  /**
   * 1. Dashboard Overview Metrics
   */
  async getDashboardStats(range: '7d' | '30d' | '90d' | '1y' = '30d') {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    // Compute range start date
    const rangeDays = range === '7d' ? 7 : range === '90d' ? 90 : range === '1y' ? 365 : 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - rangeDays);

    // 1. KPI Counts
    const [
      totalBookings,
      totalCustomers,
      activeTrips,
      pendingPayments,
      upcomingTrips,
      paidBookings,
    ] = await Promise.all([
      Booking.countDocuments({}),
      User.countDocuments({ role: { $ne: 'admin' } }),
      Trip.countDocuments({ isPublished: true }),
      Booking.countDocuments({
        $or: [{ paymentStatus: 'pending' }, { bookingStatus: 'pending_payment' }],
      }),
      Booking.countDocuments({
        bookingStatus: 'confirmed',
        travelDate: { $gte: todayStr },
      }),
      Booking.find({
        $or: [{ paymentStatus: 'paid' }, { bookingStatus: 'confirmed' }],
      }).select('pricing amountPaid createdAt travelDate destinationName tripSnapshot').lean(),
    ]);

    // Calculate total revenue from verified successful bookings/payments
    const totalRevenue = paidBookings.reduce((sum, b: any) => {
      const amount = b.amountPaid !== undefined && b.amountPaid > 0 ? b.amountPaid : b.pricing?.totalAmount || 0;
      return sum + amount;
    }, 0);

    // 2. Revenue chart aggregated over time
    // Generate buckets based on range
    const revenueByBucket: Record<string, number> = {};
    const bookingTrendsByBucket: Record<string, { confirmed: number; pending: number; cancelled: number }> = {};

    // Initialize buckets
    const numBuckets = range === '7d' ? 7 : range === '30d' ? 15 : range === '90d' ? 12 : 12;
    for (let i = 0; i < numBuckets; i++) {
      const d = new Date(startDate.getTime() + (i / numBuckets) * (today.getTime() - startDate.getTime()));
      const key = range === '7d' || range === '30d'
        ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        : d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      revenueByBucket[key] = 0;
      bookingTrendsByBucket[key] = { confirmed: 0, pending: 0, cancelled: 0 };
    }

    // Populate actual booking data into buckets
    const allBookingsForTrends = await Booking.find({
      createdAt: { $gte: startDate },
    }).select('createdAt bookingStatus paymentStatus pricing amountPaid').lean();

    allBookingsForTrends.forEach((b: any) => {
      const bDate = new Date(b.createdAt);
      const key = range === '7d' || range === '30d'
        ? bDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        : bDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });

      const amount = b.amountPaid || b.pricing?.totalAmount || 0;
      if (b.paymentStatus === 'paid' || b.bookingStatus === 'confirmed') {
        revenueByBucket[key] = (revenueByBucket[key] || 0) + amount;
      }

      if (!bookingTrendsByBucket[key]) {
        bookingTrendsByBucket[key] = { confirmed: 0, pending: 0, cancelled: 0 };
      }
      if (b.bookingStatus === 'confirmed' || b.paymentStatus === 'paid') {
        bookingTrendsByBucket[key].confirmed++;
      } else if (b.bookingStatus === 'cancelled') {
        bookingTrendsByBucket[key].cancelled++;
      } else {
        bookingTrendsByBucket[key].pending++;
      }
    });

    const revenueChart = Object.entries(revenueByBucket).map(([label, value]) => ({
      label,
      revenue: value,
    }));

    const bookingTrends = Object.entries(bookingTrendsByBucket).map(([label, counts]) => ({
      label,
      ...counts,
    }));

    // 3. Popular Destinations by Actual Booking Data
    const destMap: Record<string, { bookings: number; revenue: number; ratingTotal: number; ratingCount: number }> = {};
    paidBookings.forEach((b: any) => {
      const dest = b.destinationName || b.tripSnapshot?.destination || 'Other';
      if (!destMap[dest]) {
        destMap[dest] = { bookings: 0, revenue: 0, ratingTotal: 0, ratingCount: 0 };
      }
      destMap[dest].bookings++;
      destMap[dest].revenue += (b.amountPaid || b.pricing?.totalAmount || 0);
    });

    // Merge average rating from trips
    const allTrips = await Trip.find({}).select('destinationName rating').lean();
    allTrips.forEach((t: any) => {
      if (destMap[t.destinationName]) {
        destMap[t.destinationName].ratingTotal += t.rating || 4.8;
        destMap[t.destinationName].ratingCount++;
      }
    });

    const popularDestinations = Object.entries(destMap)
      .map(([destination, stats]) => ({
        destination,
        bookings: stats.bookings,
        revenue: stats.revenue,
        rating: stats.ratingCount > 0 ? +(stats.ratingTotal / stats.ratingCount).toFixed(1) : 4.9,
      }))
      .sort((a, b) => b.bookings - a.bookings)
      .slice(0, 5);

    // 4. Recent Bookings (top 6)
    const recentBookings = await Booking.find({})
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();

    return {
      kpis: {
        totalRevenue,
        totalBookings,
        totalCustomers,
        activeTrips,
        pendingPayments,
        upcomingTrips,
      },
      revenueChart,
      bookingTrends,
      popularDestinations,
      recentBookings,
      range,
    };
  }

  /**
   * 2. Bookings Management (Filter, Search, Sort, Paginate)
   */
  async getBookings(query: any) {
    const {
      page = 1,
      limit = 10,
      search,
      bookingStatus,
      paymentStatus,
      destination,
      minAmount,
      maxAmount,
      startDate,
      endDate,
      sort = 'newest',
    } = query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const filter: any = {};

    // Search query
    if (search && typeof search === 'string' && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { bookingId: regex },
        { 'primaryTraveller.name': regex },
        { 'primaryTraveller.email': regex },
        { 'primaryTraveller.phone': regex },
        { 'tripSnapshot.title': regex },
        { destinationName: regex },
      ];
    }

    // Status filters
    if (bookingStatus && bookingStatus !== 'all') {
      filter.bookingStatus = bookingStatus;
    }
    if (paymentStatus && paymentStatus !== 'all') {
      filter.paymentStatus = paymentStatus;
    }
    if (destination && destination !== 'all') {
      filter.destinationName = new RegExp(`^${destination.trim()}$`, 'i');
    }

    // Amount range
    if (minAmount !== undefined || maxAmount !== undefined) {
      filter['pricing.totalAmount'] = {};
      if (minAmount) filter['pricing.totalAmount'].$gte = Number(minAmount);
      if (maxAmount) filter['pricing.totalAmount'].$lte = Number(maxAmount);
    }

    // Date range
    if (startDate || endDate) {
      filter.travelDate = {};
      if (startDate) filter.travelDate.$gte = startDate;
      if (endDate) filter.travelDate.$lte = endDate;
    }

    // Sorting
    let sortObj: any = { createdAt: -1 };
    switch (sort) {
      case 'oldest':
        sortObj = { createdAt: 1 };
        break;
      case 'highest_amount':
        sortObj = { 'pricing.totalAmount': -1 };
        break;
      case 'lowest_amount':
        sortObj = { 'pricing.totalAmount': 1 };
        break;
      case 'travel_date':
        sortObj = { travelDate: 1 };
        break;
      default:
        sortObj = { createdAt: -1 };
    }

    const [total, bookings] = await Promise.all([
      Booking.countDocuments(filter),
      Booking.find(filter).sort(sortObj).skip(skip).limit(limitNum).lean(),
    ]);

    const totalPages = Math.ceil(total / limitNum) || 1;

    return {
      bookings,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
      },
    };
  }

  /**
   * 3. Single Booking Details
   */
  async getBookingById(id: string) {
    const clean = id.trim().toUpperCase();
    const booking = await Booking.findOne({
      $or: [
        { bookingId: clean },
        { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null },
      ],
    }).lean();

    if (!booking) {
      const err = new Error('Booking not found');
      (err as any).statusCode = 404;
      throw err;
    }

    // Fetch related payment if available
    const payment = await Payment.findOne({
      $or: [
        { bookingId: booking.bookingId },
        { paymentId: (booking as any).paymentId },
      ],
    }).lean();

    // Fetch user details
    const user = await User.findById(booking.userId).select('name email phone role emailVerified').lean();

    return {
      booking,
      payment,
      user,
    };
  }

  /**
   * 4. Admin Cancel Booking
   */
  async cancelBooking(id: string, reason: string, adminUserId: string) {
    const clean = id.trim().toUpperCase();
    const booking = await Booking.findOne({
      $or: [
        { bookingId: clean },
        { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null },
      ],
    });

    if (!booking) {
      const err = new Error('Booking not found');
      (err as any).statusCode = 404;
      throw err;
    }

    if (booking.bookingStatus === 'cancelled') {
      const err = new Error('This booking is already cancelled.');
      (err as any).statusCode = 400;
      throw err;
    }

    const { refundAmount, cancellationFee, policyTier } = pricingService.calculateRefund(booking);

    booking.bookingStatus = 'cancelled';
    booking.paymentStatus = 'refunded';
    booking.refundStatus = 'initiated';
    booking.cancellation = {
      cancelledAt: new Date(),
      reason: `Admin Cancellation: ${reason || 'Operational adjustment'}`,
      cancellationFee,
      refundAmount,
      policyTier,
    };

    // Non-blocking admin cancellation email dispatch
    try {
      const recipientEmail = booking.primaryTraveller?.email;
      if (recipientEmail) {
        await emailService.sendCancellationConfirmation(recipientEmail, {
          customerName: booking.primaryTraveller?.name || 'Valued Traveller',
          bookingId: booking.bookingId,
          tripTitle: booking.tripSnapshot?.title || 'SukhYatri Journey',
          travelDate: booking.travelDate,
          cancellationDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
          cancellationReason: `Administrative update: ${reason || 'Operational adjustment'}`,
          refundAmount,
          refundStatus: 'Initiated (5–7 banking days via Razorpay)',
        });
        booking.cancellationEmailSentAt = new Date();
      }
    } catch (e) {
      console.warn('[AdminService] Non-critical cancellation email failure:', e);
    }

    await booking.save();

    await this.logAudit(adminUserId, 'cancel', 'booking', booking.bookingId, {
      reason,
      refundAmount,
      cancellationFee,
    });

    return booking;
  }

  /**
   * 5. Packages (Trips) CMS Management
   */
  async getPackages(query: any) {
    const { page = 1, limit = 20, search, status, destination } = query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const filter: any = {};
    if (search && typeof search === 'string' && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [{ title: regex }, { destinationName: regex }, { state: regex }, { slug: regex }];
    }
    if (status === 'published') filter.isPublished = true;
    if (status === 'draft') filter.isPublished = false;
    if (destination && destination !== 'all') {
      filter.destinationName = new RegExp(`^${destination.trim()}$`, 'i');
    }

    const [total, packages] = await Promise.all([
      Trip.countDocuments(filter),
      Trip.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
    ]);

    return {
      packages,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    };
  }

  async getPackageById(id: string) {
    const trip = await Trip.findOne({
      $or: [
        { slug: id.toLowerCase() },
        { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null },
      ],
    }).lean();

    if (!trip) {
      const err = new Error('Package not found');
      (err as any).statusCode = 404;
      throw err;
    }
    return trip;
  }

  async createPackage(data: any, adminUserId: string) {
    // Generate slug if missing
    if (!data.slug && data.title) {
      data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    // Normalize required fields for Trip model
    data.description = data.description || data.fullDescription || data.shortDescription || 'Curated journey with SukhYatri.';
    data.shortDescription = data.shortDescription || data.description.slice(0, 160);
    data.destinationName = data.destinationName || 'India';
    data.state = data.state || data.destinationName || 'India';
    data.days = Number(data.days) || (data.itinerary?.length ? data.itinerary.length : 5);
    data.nights = Number(data.nights) || Math.max(1, (data.days || 5) - 1);
    data.duration = data.duration || `${data.days} Days / ${data.nights} Nights`;
    const rawImages = data.images && data.images.length > 0 ? data.images : (data.heroImage ? [data.heroImage, ...(data.gallery || [])] : []);
    data.images = sanitizeImageGallery(rawImages);
    if (data.images.length === 0) {
      data.images = ['https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80'];
    }
    data.price = Number(data.price) || 25000;

    // Check slug uniqueness
    const existing = await Trip.findOne({ slug: data.slug.toLowerCase() });
    if (existing) {
      const err = new Error(`A package with slug "${data.slug}" already exists.`);
      (err as any).statusCode = 400;
      throw err;
    }

    const created = await Trip.create(data);
    await this.logAudit(adminUserId, 'create', 'package', created._id.toString(), {
      title: created.title,
      slug: created.slug,
    });
    return created;
  }

  async updatePackage(id: string, data: any, adminUserId: string) {
    const trip = await Trip.findOne({
      $or: [
        { slug: id.toLowerCase() },
        { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null },
      ],
    });

    if (!trip) {
      const err = new Error('Package not found');
      (err as any).statusCode = 404;
      throw err;
    }

    if (data.slug && data.slug.toLowerCase() !== trip.slug) {
      const existing = await Trip.findOne({ slug: data.slug.toLowerCase(), _id: { $ne: trip._id } });
      if (existing) {
        const err = new Error(`A package with slug "${data.slug}" already exists.`);
        (err as any).statusCode = 400;
        throw err;
      }
    }

    if (data.description || data.fullDescription) {
      data.description = data.description || data.fullDescription;
    }
    if (data.days) data.days = Number(data.days);
    if (data.nights) data.nights = Number(data.nights);
    if (data.price) data.price = Number(data.price);
    if (data.images || data.heroImage) {
      const raw = data.images && data.images.length > 0 ? data.images : [data.heroImage, ...(data.gallery || [])];
      data.images = sanitizeImageGallery(raw);
    }

    Object.assign(trip, data);
    const updated = await trip.save();
    await this.logAudit(adminUserId, 'update', 'package', updated._id.toString(), {
      title: updated.title,
    });
    return updated;
  }

  async togglePackagePublish(id: string, adminUserId: string) {
    const trip = await Trip.findOne({
      $or: [
        { slug: id.toLowerCase() },
        { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null },
      ],
    });

    if (!trip) {
      const err = new Error('Package not found');
      (err as any).statusCode = 404;
      throw err;
    }

    trip.isPublished = !trip.isPublished;
    await trip.save();
    await this.logAudit(adminUserId, trip.isPublished ? 'publish' : 'unpublish', 'package', trip._id.toString());
    return trip;
  }

  async deletePackage(id: string, adminUserId: string) {
    const trip = await Trip.findOneAndDelete({
      $or: [
        { slug: id.toLowerCase() },
        { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null },
      ],
    });

    if (!trip) {
      const err = new Error('Package not found');
      (err as any).statusCode = 404;
      throw err;
    }

    await this.logAudit(adminUserId, 'delete', 'package', trip._id.toString(), {
      title: trip.title,
    });
    return { success: true, message: 'Package deleted successfully' };
  }

  /**
   * 6. Destination CMS Management
   */
  async getDestinations(query: any) {
    const { page = 1, limit = 20, search } = query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const filter: any = {};
    if (search && typeof search === 'string' && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [{ name: regex }, { state: regex }, { slug: regex }];
    }

    const [total, destinations] = await Promise.all([
      Destination.countDocuments(filter),
      Destination.find(filter).sort({ name: 1 }).skip(skip).limit(limitNum).lean(),
    ]);

    // Attach trip counts per destination
    const tripCounts = await Trip.aggregate([
      { $group: { _id: '$destinationName', count: { $sum: 1 } } },
    ]);
    const tripCountMap: Record<string, number> = {};
    tripCounts.forEach((tc) => {
      tripCountMap[tc._id?.toLowerCase()] = tc.count;
    });

    const enriched = destinations.map((d: any) => ({
      ...d,
      tripCount: tripCountMap[d.name?.toLowerCase()] || 0,
    }));

    return {
      destinations: enriched,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    };
  }

  async getDestinationById(id: string) {
    const dest = await Destination.findOne({
      $or: [
        { slug: id.toLowerCase() },
        { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null },
      ],
    }).lean();

    if (!dest) {
      const err = new Error('Destination not found');
      (err as any).statusCode = 404;
      throw err;
    }
    return dest;
  }

  async createDestination(data: any, adminUserId: string) {
    if (!data.slug && data.name) {
      data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    if (data.gallery) {
      data.gallery = sanitizeImageGallery(data.gallery);
    }
    if (!data.heroImage || !isValidImageUrl(data.heroImage)) {
      data.heroImage = data.gallery?.[0] || 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=1200&q=80';
    }

    const existing = await Destination.findOne({ slug: data.slug.toLowerCase() });
    if (existing) {
      const err = new Error(`A destination with slug "${data.slug}" already exists.`);
      (err as any).statusCode = 400;
      throw err;
    }

    const created = await Destination.create(data);
    await this.logAudit(adminUserId, 'create', 'destination', created._id.toString(), {
      name: created.name,
      slug: created.slug,
    });
    return created;
  }

  async updateDestination(id: string, data: any, adminUserId: string) {
    const dest = await Destination.findOne({
      $or: [
        { slug: id.toLowerCase() },
        { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null },
      ],
    });

    if (!dest) {
      const err = new Error('Destination not found');
      (err as any).statusCode = 404;
      throw err;
    }

    if (data.slug && data.slug.toLowerCase() !== dest.slug) {
      const existing = await Destination.findOne({ slug: data.slug.toLowerCase(), _id: { $ne: dest._id } });
      if (existing) {
        const err = new Error(`A destination with slug "${data.slug}" already exists.`);
        (err as any).statusCode = 400;
        throw err;
      }
    }

    if (data.gallery) {
      data.gallery = sanitizeImageGallery(data.gallery);
    }
    if (data.heroImage && !isValidImageUrl(data.heroImage)) {
      data.heroImage = data.gallery?.[0] || dest.heroImage;
    }

    Object.assign(dest, data);
    const updated = await dest.save();
    await this.logAudit(adminUserId, 'update', 'destination', updated._id.toString(), {
      name: updated.name,
    });
    return updated;
  }

  async toggleDestinationPublish(id: string, adminUserId: string) {
    const dest = await Destination.findOne({
      $or: [
        { slug: id.toLowerCase() },
        { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null },
      ],
    });

    if (!dest) {
      const err = new Error('Destination not found');
      (err as any).statusCode = 404;
      throw err;
    }

    dest.isPublished = !dest.isPublished;
    await dest.save();
    await this.logAudit(adminUserId, dest.isPublished ? 'publish' : 'unpublish', 'destination', dest._id.toString());
    return dest;
  }

  async deleteDestination(id: string, adminUserId: string) {
    const dest = await Destination.findOneAndDelete({
      $or: [
        { slug: id.toLowerCase() },
        { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null },
      ],
    });

    if (!dest) {
      const err = new Error('Destination not found');
      (err as any).statusCode = 404;
      throw err;
    }

    await this.logAudit(adminUserId, 'delete', 'destination', dest._id.toString(), {
      name: dest.name,
    });
    return { success: true, message: 'Destination deleted successfully' };
  }

  /**
   * 7. User & Guest Management
   */
  async getUsers(query: any) {
    const { page = 1, limit = 15, search, role, status } = query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 15));
    const skip = (pageNum - 1) * limitNum;

    const filter: any = {};
    if (search && typeof search === 'string' && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [{ name: regex }, { email: regex }, { phone: regex }];
    }
    if (role && role !== 'all') filter.role = role;
    if (status && status !== 'all') filter.status = status;

    const [total, users] = await Promise.all([
      User.countDocuments(filter),
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
    ]);

    // Aggregate booking counts & total spend per user
    const userIds = users.map((u: any) => u._id);
    const userBookings = await Booking.aggregate([
      { $match: { userId: { $in: userIds } } },
      {
        $group: {
          _id: '$userId',
          bookingCount: { $sum: 1 },
          totalSpent: {
            $sum: {
              $cond: [
                { $or: [{ $eq: ['$paymentStatus', 'paid'] }, { $eq: ['$bookingStatus', 'confirmed'] }] },
                { $ifNull: ['$amountPaid', '$pricing.totalAmount'] },
                0,
              ],
            },
          },
        },
      },
    ]);

    const bookingMetricsMap: Record<string, { count: number; spend: number }> = {};
    userBookings.forEach((ub) => {
      bookingMetricsMap[ub._id.toString()] = {
        count: ub.bookingCount,
        spend: ub.totalSpent,
      };
    });

    const enrichedUsers = users.map((u: any) => ({
      ...u,
      bookingCount: bookingMetricsMap[u._id.toString()]?.count || 0,
      totalSpent: bookingMetricsMap[u._id.toString()]?.spend || 0,
    }));

    return {
      users: enrichedUsers,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    };
  }

  async getUserDetails(id: string) {
    const user = await User.findById(id).lean();
    if (!user) {
      const err = new Error('User not found');
      (err as any).statusCode = 404;
      throw err;
    }

    const bookings = await Booking.find({ userId: user._id }).sort({ createdAt: -1 }).lean();
    const totalSpent = bookings.reduce((sum, b: any) => {
      if (b.paymentStatus === 'paid' || b.bookingStatus === 'confirmed') {
        return sum + (b.amountPaid || b.pricing?.totalAmount || 0);
      }
      return sum;
    }, 0);

    return {
      user,
      bookings,
      metrics: {
        totalBookings: bookings.length,
        totalSpent,
      },
    };
  }

  async updateUserRole(id: string, role: 'user' | 'admin', adminUserId: string) {
    const user = await User.findByIdAndUpdate(id, { role }, { new: true }).lean();
    if (!user) {
      const err = new Error('User not found');
      (err as any).statusCode = 404;
      throw err;
    }
    await this.logAudit(adminUserId, 'update_role', 'user', id, { newRole: role });
    return user;
  }

  async updateUserStatus(id: string, status: 'active' | 'suspended', adminUserId: string) {
    const user = await User.findByIdAndUpdate(id, { status }, { new: true }).lean();
    if (!user) {
      const err = new Error('User not found');
      (err as any).statusCode = 404;
      throw err;
    }
    await this.logAudit(adminUserId, 'update_status', 'user', id, { newStatus: status });
    return user;
  }

  /**
   * 8. Payments Management
   */
  async getPayments(query: any) {
    const { page = 1, limit = 15, search, status, method } = query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 15));
    const skip = (pageNum - 1) * limitNum;

    const filter: any = {};
    if (search && typeof search === 'string' && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { paymentId: regex },
        { bookingId: regex },
        { razorpayPaymentId: regex },
        { razorpayOrderId: regex },
      ];
    }
    if (status && status !== 'all') filter.status = status;
    if (method && method !== 'all') filter.method = method;

    const [total, payments] = await Promise.all([
      Payment.countDocuments(filter),
      Payment.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
    ]);

    // Attach customer names from bookings
    const bookingIds = payments.map((p: any) => p.bookingId);
    const bookings = await Booking.find({ bookingId: { $in: bookingIds } })
      .select('bookingId primaryTraveller destinationName tripSnapshot')
      .lean();

    const bookingMap: Record<string, any> = {};
    bookings.forEach((b: any) => {
      bookingMap[b.bookingId] = b;
    });

    const enriched = payments.map((p: any) => ({
      ...p,
      customerName: bookingMap[p.bookingId]?.primaryTraveller?.name || 'Yatri',
      customerEmail: bookingMap[p.bookingId]?.primaryTraveller?.email || '',
      tripTitle: bookingMap[p.bookingId]?.tripSnapshot?.title || '',
      destination: bookingMap[p.bookingId]?.destinationName || '',
    }));

    return {
      payments: enriched,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    };
  }

  /**
   * 9. Coupons CMS Management
   */
  async getCoupons(query: any) {
    const { page = 1, limit = 20, search } = query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const filter: any = {};
    if (search && typeof search === 'string' && search.trim()) {
      filter.code = new RegExp(search.trim(), 'i');
    }

    const [total, coupons] = await Promise.all([
      Coupon.countDocuments(filter),
      Coupon.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
    ]);

    return {
      coupons,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    };
  }

  async createCoupon(data: any, adminUserId: string) {
    const cleanCode = data.code.trim().toUpperCase();
    const existing = await Coupon.findOne({ code: cleanCode });
    if (existing) {
      const err = new Error(`Promo coupon code "${cleanCode}" already exists.`);
      (err as any).statusCode = 400;
      throw err;
    }

    const created = await Coupon.create({
      ...data,
      code: cleanCode,
    });

    await this.logAudit(adminUserId, 'create', 'coupon', created._id.toString(), {
      code: created.code,
    });
    return created;
  }

  async updateCoupon(id: string, data: any, adminUserId: string) {
    const coupon = await Coupon.findById(id);
    if (!coupon) {
      const err = new Error('Coupon not found');
      (err as any).statusCode = 404;
      throw err;
    }

    if (data.code && data.code.toUpperCase() !== coupon.code) {
      const existing = await Coupon.findOne({ code: data.code.toUpperCase(), _id: { $ne: coupon._id } });
      if (existing) {
        const err = new Error(`Coupon code "${data.code}" already exists.`);
        (err as any).statusCode = 400;
        throw err;
      }
      coupon.code = data.code.toUpperCase();
    }

    Object.assign(coupon, data);
    const updated = await coupon.save();
    await this.logAudit(adminUserId, 'update', 'coupon', updated._id.toString(), {
      code: updated.code,
    });
    return updated;
  }

  async toggleCouponActive(id: string, adminUserId: string) {
    const coupon = await Coupon.findById(id);
    if (!coupon) {
      const err = new Error('Coupon not found');
      (err as any).statusCode = 404;
      throw err;
    }
    coupon.isActive = !coupon.isActive;
    await coupon.save();
    await this.logAudit(adminUserId, coupon.isActive ? 'activate' : 'deactivate', 'coupon', coupon._id.toString());
    return coupon;
  }

  async deleteCoupon(id: string, adminUserId: string) {
    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon) {
      const err = new Error('Coupon not found');
      (err as any).statusCode = 404;
      throw err;
    }
    await this.logAudit(adminUserId, 'delete', 'coupon', coupon._id.toString(), {
      code: coupon.code,
    });
    return { success: true, message: 'Coupon deleted successfully' };
  }

  /**
   * 10. Reviews Moderation
   */
  async getReviews(query: any) {
    const { page = 1, limit = 20, rating, status } = query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const filter: any = {};
    if (rating && rating !== 'all') filter.rating = Number(rating);
    if (status === 'published') filter.isPublished = true;
    if (status === 'hidden') filter.isPublished = false;

    const [total, reviews] = await Promise.all([
      Review.countDocuments(filter),
      Review.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
    ]);

    return {
      reviews,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    };
  }

  async updateReviewStatus(id: string, statusOrIsPublished: string | boolean, adminUserId: string) {
    const isPublished =
      typeof statusOrIsPublished === 'boolean'
        ? statusOrIsPublished
        : statusOrIsPublished === 'approved';
    const review = await Review.findByIdAndUpdate(
      id,
      { isPublished, status: isPublished ? 'approved' : 'rejected' },
      { new: true }
    ).lean();
    if (!review) {
      const err = new Error('Review not found');
      (err as any).statusCode = 404;
      throw err;
    }
    await this.logAudit(adminUserId, isPublished ? 'approve' : 'hide', 'review', id);
    return review;
  }

  async deleteReview(id: string, adminUserId: string) {
    const review = await Review.findByIdAndDelete(id);
    if (!review) {
      const err = new Error('Review not found');
      (err as any).statusCode = 404;
      throw err;
    }
    await this.logAudit(adminUserId, 'delete', 'review', id);
    return { success: true, message: 'Review deleted successfully' };
  }

  /**
   * 11. Deep Analytics
   */
  async getAnalytics() {
    const now = new Date();

    // 1. Time-window revenue (daily, weekly, monthly, yearly)
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);

    const paidFilter = {
      $or: [{ paymentStatus: 'paid' }, { bookingStatus: 'confirmed' }],
    };

    const [dailyRev, weeklyRev, monthlyRev, yearlyRev] = await Promise.all([
      Booking.find({ ...paidFilter, createdAt: { $gte: oneDayAgo } }).select('amountPaid pricing').lean(),
      Booking.find({ ...paidFilter, createdAt: { $gte: sevenDaysAgo } }).select('amountPaid pricing').lean(),
      Booking.find({ ...paidFilter, createdAt: { $gte: thirtyDaysAgo } }).select('amountPaid pricing').lean(),
      Booking.find({ ...paidFilter, createdAt: { $gte: oneYearAgo } }).select('amountPaid pricing').lean(),
    ]);

    const sumRevenue = (arr: any[]) =>
      arr.reduce((sum, b) => sum + (b.amountPaid || b.pricing?.totalAmount || 0), 0);

    // 2. Booking status distribution
    const [totalBookings, confirmedCount, cancelledCount, pendingCount] = await Promise.all([
      Booking.countDocuments({}),
      Booking.countDocuments({ bookingStatus: 'confirmed' }),
      Booking.countDocuments({ bookingStatus: 'cancelled' }),
      Booking.countDocuments({
        $or: [{ bookingStatus: 'pending_payment' }, { paymentStatus: 'pending' }],
      }),
    ]);

    // 3. Customer analytics: New vs Returning
    const customerBookings = await Booking.aggregate([
      { $group: { _id: '$userId', count: { $sum: 1 } } },
    ]);
    const returningUsersCount = customerBookings.filter((c) => c.count > 1).length;
    const singleTripUsersCount = customerBookings.filter((c) => c.count === 1).length;
    const totalRegisteredUsers = await User.countDocuments({ role: { $ne: 'admin' } });

    // 4. Destination breakdown
    const destStats = await Booking.aggregate([
      {
        $group: {
          _id: '$destinationName',
          bookings: { $sum: 1 },
          revenue: {
            $sum: {
              $cond: [
                { $or: [{ $eq: ['$paymentStatus', 'paid'] }, { $eq: ['$bookingStatus', 'confirmed'] }] },
                { $ifNull: ['$amountPaid', '$pricing.totalAmount'] },
                0,
              ],
            },
          },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 6 },
    ]);

    // 5. Packages breakdown
    const packageStats = await Booking.aggregate([
      {
        $group: {
          _id: '$tripSnapshot.title',
          destination: { $first: '$destinationName' },
          bookings: { $sum: 1 },
          revenue: {
            $sum: {
              $cond: [
                { $or: [{ $eq: ['$paymentStatus', 'paid'] }, { $eq: ['$bookingStatus', 'confirmed'] }] },
                { $ifNull: ['$amountPaid', '$pricing.totalAmount'] },
                0,
              ],
            },
          },
        },
      },
      { $sort: { bookings: -1 } },
      { $limit: 6 },
    ]);

    return {
      revenue: {
        daily: sumRevenue(dailyRev),
        weekly: sumRevenue(weeklyRev),
        monthly: sumRevenue(monthlyRev),
        yearly: sumRevenue(yearlyRev),
      },
      bookings: {
        total: totalBookings,
        confirmed: confirmedCount,
        cancelled: cancelledCount,
        pending: pendingCount,
      },
      customers: {
        totalUsers: totalRegisteredUsers,
        newUsers: singleTripUsersCount,
        returningUsers: returningUsersCount,
      },
      destinations: destStats.map((d) => ({
        destination: d._id || 'Unknown',
        bookings: d.bookings,
        revenue: d.revenue,
      })),
      packages: packageStats.map((p) => ({
        title: p._id || 'Curated Journey',
        destination: p.destination || '',
        bookings: p.bookings,
        revenue: p.revenue,
      })),
    };
  }

  /**
   * 12. Settings Configuration
   */
  async getSettings() {
    const defaultSettings = {
      platformName: 'SukhYatri',
      supportEmail: 'concierge@sukhyatri.com',
      supportPhone: '+91 800 234 5678',
      gstNumber: '32AABCS1429B1Z8',
      currency: 'INR',
      razorpayTestMode: true,
      freeCancellationHours: 48,
      platformCommissionPct: 15,
    };

    const settingRecord = await Setting.findOne({ key: 'platform_config' }).lean();
    return settingRecord ? { ...defaultSettings, ...settingRecord.value } : defaultSettings;
  }

  async updateSettings(data: any, adminUserId: string) {
    const updated = await Setting.findOneAndUpdate(
      { key: 'platform_config' },
      {
        key: 'platform_config',
        value: data,
        updatedBy: adminUserId,
      },
      { upsert: true, new: true }
    );

    await this.logAudit(adminUserId, 'update', 'settings', 'platform_config', {
      updatedKeys: Object.keys(data),
    });

    return updated.value;
  }
}

export const adminService = new AdminService();
