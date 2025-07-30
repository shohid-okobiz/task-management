import { Request, Response, NextFunction } from 'express';
import FlatBookingService from './flatbooking.service';
import logger from '../../configs/logger.configs';

const FlatBookingController = {
    handleCreateFlatBooking: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { userId } = req.authenticateTokenDecoded;
            const bookingData = { ...req.body, user: userId };
            const booking = await FlatBookingService.createBooking(bookingData);
            res.status(201).json({
                status: 'success',
                message: 'Flat booking submitted successfully',
                data: booking,
            });
        } catch (error) {
            const err = error as Error;
            logger.error(err.message);
            next(err);
        }
    },

    handleGetAllFlatBookings: async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const bookings = await FlatBookingService.getAllBookings();
            res.status(200).json({
                status: 'success',
                message: 'All flat bookings retrieved successfully',
                data: bookings,
            });
        } catch (error) {
            const err = error as Error;
            logger.error(err.message);
            next(err);
        }
    },

    handleGetFlatBookingById: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const booking = await FlatBookingService.getBookingById(req.params.id);
            res.status(200).json({
                status: 'success',
                message: 'Flat booking retrieved successfully',
                data: booking,
            });
        } catch (error) {
            const err = error as Error;
            logger.error(err.message);
            next(err);
        }
    },

    handleUpdateFlatBookingStatus: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { status } = req.body;
            const updated = await FlatBookingService.updateBookingStatus(req.params.id, status);
            res.status(200).json({
                status: 'success',
                message: 'Flat booking status updated successfully',
                data: updated,
            });
        } catch (error) {
            const err = error as Error;
            logger.error(err.message);
            next(err);
        }
    },

    handleDeleteFlatBooking: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const deleted = await FlatBookingService.deleteBooking(req.params.id);
            res.status(200).json({
                status: 'success',
                message: 'Flat booking deleted successfully',
                data: deleted,
            });
        } catch (error) {
            const err = error as Error;
            logger.error(err.message);
            next(err);
        }
    },

    handleFlatBookingStats: async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const stats = await FlatBookingService.getBookingStats();
            res.status(200).json({
                status: 'success',
                message: 'Flat booking stats retrieved successfully',
                data: stats,
            });
        } catch (error) {
            const err = error as Error;
            logger.error(err.message);
            next(err);
        }
    },

    handleAvailableFlatStats: async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const [list, count] = await Promise.all([
                FlatBookingService.getAvailableFlats(),
                FlatBookingService.countAvailableFlats(),
            ]);
            res.status(200).json({
                status: 'success',
                message: 'Available flats retrieved successfully',
                data: { count, list },
            });
        } catch (error) {
            const err = error as Error;
            logger.error(err.message);
            next(err);
        }
    },

    handleSoldOutFlatStats: async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const [list, count] = await Promise.all([
                FlatBookingService.getSoldOutFlats(),
                FlatBookingService.countSoldOutFlats(),
            ]);
            res.status(200).json({
                status: 'success',
                message: 'Sold out flats retrieved successfully',
                data: { count, list },
            });
        } catch (error) {
            const err = error as Error;
            logger.error(err.message);
            next(err);
        }
    },
};

export default FlatBookingController;
