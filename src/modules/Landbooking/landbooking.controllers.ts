import { Request, Response, NextFunction } from 'express';
import logger from '../../configs/logger.configs';
import LandBookingService from './landbooking.services';


const LandBookingController = {
  handleCreateLandBooking: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.authenticateTokenDecoded;
      const bookingData = { ...req.body, user: userId };
      const booking = await LandBookingService.createBooking(bookingData);
      res.status(201).json({
        status: 'success',
        message: 'Land booking submitted successfully',
        data: booking,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(err);
    }
  },

  handleGetAllLandBookings: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const bookings = await LandBookingService.getAllBookings();
      res.status(200).json({
        status: 'success',
        message: 'All land bookings retrieved successfully',
        data: bookings,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(err);
    }
  },

  handleGetLandBookingById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const booking = await LandBookingService.getBookingById(req.params.id);
      res.status(200).json({
        status: 'success',
        message: 'Land booking fetched successfully',
        data: booking,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(err);
    }
  },

  handleUpdateLandBookingStatus: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status } = req.body;
      const updated = await LandBookingService.updateBookingStatus(req.params.id, status);
      res.status(200).json({
        status: 'success',
        message: 'Land booking status updated successfully',
        data: updated,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(err);
    }
  },

  handleDeleteLandBooking: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await LandBookingService.deleteBooking(req.params.id);
      res.status(204).send();
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(err);
    }
  },

  handleLandBookingStats: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = await LandBookingService.getBookingStats();
      res.status(200).json({
        status: 'success',
        message: 'Land booking stats retrieved successfully',
        data: stats,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(err);
    }
  },
 
 handleAvailableLandStats: async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const [list, count] = await Promise.all([
      LandBookingService.getAvailableLands(),
      LandBookingService.countAvailableLands(),
    ]);

    res.status(200).json({
      status: 'success',
      message: 'Available lands retrieved successfully',
      data: { count, list },
    });
  } catch (error) {
    const err = error as Error;
    logger.error(err.message);
    next(err);
  }
},


 

};

export default LandBookingController;
