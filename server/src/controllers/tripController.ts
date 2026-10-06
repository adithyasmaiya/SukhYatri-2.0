import { Request, Response } from 'express';
import { Trip } from '../models/Trip.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

export const tripController = {
  async getAllTrips(req: Request, res: Response): Promise<void> {
    try {
      const {
        search,
        destination,
        style,
        travelStyle,
        price_min,
        price_max,
        duration,
        min_rating,
        sort,
        page = '1',
        limit = '12',
      } = req.query;

      const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
      const limitNum = Math.max(1, Math.min(100, parseInt(limit as string, 10) || 12));
      const skip = (pageNum - 1) * limitNum;

      const filter: any = { isPublished: true };

      // Text search
      if (search && typeof search === 'string' && search.trim()) {
        const regex = new RegExp(search.trim(), 'i');
        filter.$or = [
          { title: regex },
          { destinationName: regex },
          { state: regex },
          { shortDescription: regex },
          { description: regex },
          { highlights: regex },
        ];
      }

      // Destination filter
      if (destination && typeof destination === 'string') {
        const dests = destination.split(',').map((d) => d.trim());
        filter.destinationName = {
          $in: dests.map((d) => new RegExp(`^${d}$`, 'i')),
        };
      }

      // Travel style filter
      const styleFilter = style || travelStyle;
      if (styleFilter && typeof styleFilter === 'string') {
        const styles = styleFilter.split(',').map((s) => s.trim());
        filter.travelStyle = {
          $in: styles.map((s) => new RegExp(`^${s}$`, 'i')),
        };
      }

      // Price range
      if (price_min !== undefined || price_max !== undefined) {
        filter.price = {};
        if (price_min !== undefined) {
          filter.price.$gte = parseInt(price_min as string, 10) || 0;
        }
        if (price_max !== undefined) {
          filter.price.$lte = parseInt(price_max as string, 10) || Number.MAX_SAFE_INTEGER;
        }
      }

      // Minimum rating
      if (min_rating !== undefined) {
        filter.rating = { $gte: parseFloat(min_rating as string) || 0 };
      }

      // Sorting
      let sortCriteria: any = { rating: -1, reviewCount: -1 };
      switch (sort) {
        case 'price_low':
          sortCriteria = { price: 1 };
          break;
        case 'price_high':
          sortCriteria = { price: -1 };
          break;
        case 'rating':
          sortCriteria = { rating: -1 };
          break;
        case 'popular':
          sortCriteria = { reviewCount: -1 };
          break;
        case 'newest':
          sortCriteria = { createdAt: -1 };
          break;
        default:
          sortCriteria = { rating: -1, reviewCount: -1 };
          break;
      }

      const total = await Trip.countDocuments(filter);
      const trips = await Trip.find(filter)
        .sort(sortCriteria)
        .skip(skip)
        .limit(limitNum);

      const totalPages = Math.ceil(total / limitNum) || 1;

      sendSuccess(
        res,
        trips,
        200,
        undefined,
        {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages,
        }
      );
    } catch (err: any) {
      sendError(res, err.message || 'Failed to fetch trips', 500);
    }
  },

  async getTripBySlug(req: Request, res: Response): Promise<void> {
    try {
      const { slug } = req.params;
      const clean = slug.toLowerCase();

      // Check slug first, fallback to id if valid ObjectId
      let trip = await Trip.findOne({
        slug: clean,
        isPublished: true,
      });

      if (!trip && clean.match(/^[0-9a-fA-F]{24}$/)) {
        trip = await Trip.findById(clean);
      }

      if (!trip) {
        sendError(res, 'Trip not found', 404, 'TRIP_NOT_FOUND');
        return;
      }

      sendSuccess(res, trip);
    } catch (err: any) {
      sendError(res, err.message || 'Failed to fetch trip details', 500);
    }
  },

  async createTrip(req: Request, res: Response): Promise<void> {
    try {
      const trip = await Trip.create(req.body);
      sendSuccess(res, trip, 201, 'Trip created successfully');
    } catch (err: any) {
      sendError(res, err.message || 'Failed to create trip', 400);
    }
  },

  async updateTrip(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const trip = await Trip.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!trip) {
        sendError(res, 'Trip not found', 404);
        return;
      }

      sendSuccess(res, trip, 200, 'Trip updated successfully');
    } catch (err: any) {
      sendError(res, err.message || 'Failed to update trip', 400);
    }
  },
};
