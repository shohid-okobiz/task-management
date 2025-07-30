import { NextFunction, Request, Response } from 'express';
import logger from '../../configs/logger.configs';
import BookingRentServices from './booking.rent.services';


const allowedQuery = new Set(['user_id', 'rent_id', 'checkIn', 'checkOut', 'paymentId']);


const { createBookingRent } = BookingRentServices;

const BookingRentControllers = {
  createBookingRent: async (req: Request, res: Response, next: NextFunction) => {
    const { payload } = req.body;
    console.log(payload)
    try {
      const { payload } = req.body;
      if (!payload) res.status(400).json({ status: 'error', message: 'Payload is required' });
      const valid = Object.keys(payload).every((key) => allowedQuery.has(key));
      if (!valid) throw new Error('Invalid query parameters provided');

      const data = await createBookingRent({
        payload,
      });

      res.status(200).json({
        status: 'success',
        message: 'New Field Data Added',
        data,
      });
    } catch (error) {
      console.log(error);
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },

};

export default BookingRentControllers;
