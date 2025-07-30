import { Request, Response, NextFunction } from 'express';
import RentBookingService from '../rentbooking/rentbooking.services';
import { RentBookingStatus } from '../rentbooking/rentbooking.interfaces';


const RentBookingBkashController = {
  handleBkashCallback: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { paymentID, status, merchantInvoiceNumber } = req.query;

      if (!paymentID || !merchantInvoiceNumber) {
        return res.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/payment-fail`);
      }

      const booking = await RentBookingService.getBookingById(merchantInvoiceNumber as string);

      if (!booking) {
        return res.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/payment-fail`);
      }

      if (status === 'success') {
        booking.paymentStatus = 'SUCCESS';
        booking.status = RentBookingStatus.CHECKED_IN;
      } else if (status === 'cancel') {
        booking.paymentStatus = 'CANCELLED';
        booking.status = RentBookingStatus.CANCELLED;
      } else {
        booking.paymentStatus = 'FAILED';
        booking.status = RentBookingStatus.CANCELLED;
      }

      booking.paymentDetails = req.query;  
      await booking.save();
      if (status === 'success') {
        return res.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/payment-success?bookingId=${booking._id}`);
      } else if (status === 'cancel') {
        return res.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/payment-cancel?bookingId=${booking._id}`);
      } else {
        return res.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/payment-fail?bookingId=${booking._id}`);
      }
    } catch (err) {
      next(err);
    }
  },
};


export default RentBookingBkashController;
