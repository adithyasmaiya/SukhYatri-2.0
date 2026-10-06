import { Request, Response } from 'express';
import { Destination } from '../models/Destination.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

export const destinationController = {
  async getAllDestinations(req: Request, res: Response): Promise<void> {
    try {
      const { search } = req.query;
      const query: any = { isPublished: true };

      if (search && typeof search === 'string') {
        const regex = new RegExp(search.trim(), 'i');
        query.$or = [{ name: regex }, { state: regex }, { description: regex }];
      }

      const destinations = await Destination.find(query).sort({ name: 1 });
      sendSuccess(res, destinations);
    } catch (err: any) {
      sendError(res, err.message || 'Failed to fetch destinations', 500);
    }
  },

  async getDestinationBySlug(req: Request, res: Response): Promise<void> {
    try {
      const { slug } = req.params;
      const destination = await Destination.findOne({
        slug: slug.toLowerCase(),
        isPublished: true,
      });

      if (!destination) {
        sendError(res, 'Destination not found', 404, 'DESTINATION_NOT_FOUND');
        return;
      }

      sendSuccess(res, destination);
    } catch (err: any) {
      sendError(res, err.message || 'Failed to fetch destination', 500);
    }
  },

  async createDestination(req: Request, res: Response): Promise<void> {
    try {
      const destination = await Destination.create(req.body);
      sendSuccess(res, destination, 201, 'Destination created successfully');
    } catch (err: any) {
      sendError(res, err.message || 'Failed to create destination', 400);
    }
  },

  async updateDestination(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const destination = await Destination.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!destination) {
        sendError(res, 'Destination not found', 404);
        return;
      }

      sendSuccess(res, destination, 200, 'Destination updated successfully');
    } catch (err: any) {
      sendError(res, err.message || 'Failed to update destination', 400);
    }
  },
};
