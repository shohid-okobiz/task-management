import { Request, Response, NextFunction } from 'express';
import logger from '../../configs/logger.configs';
import RentBookingService from './rentbooking.services';
import { initiateSSLCommerzPayment } from '../payment/sslcommerz.service';
import { RentBookingStatus } from './rentbooking.interfaces';


import bkashService from '../payment/bkash.service';

const RentBookingController = {
  handleCreateRentBooking: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.authenticateTokenDecoded;
      const payload = { ...req.body, user: userId };
      const booking = await RentBookingService.createBooking(payload);
      const amount = booking.price || 100;
      let paymentMethod = req.body.paymentMethod || 'sslcommerz';
      let paymentInitResult: any = {};
      if (paymentMethod === 'bkash') {
        paymentInitResult = await bkashService.createPayment(booking._id.toString(), amount);
      } else {
        const redirectUrl = await initiateSSLCommerzPayment(booking._id.toString(), amount);
        paymentInitResult = { redirectUrl };
      }
      res.status(201).json({
        status: 'success',
        message: 'Rent booking submitted successfully',
        data: booking,
        payment: paymentInitResult
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(err);
    }
  },
  // handleCreateRentBooking: async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     const { userId } = req.authenticateTokenDecoded;
  //     const payload = { ...req.body, user: userId };
  //     console.log('Booking Data:', payload); 
  //     const booking = await RentBookingService.createBooking(payload);
  //     res.status(201).json({
  //       status: 'success',
  //       message: 'Rent booking submitted successfully',
  //       data: booking,
  //     });
  //   } catch (error) {
  //     const err = error as Error;
  //     logger.error(err.message);
  //     next(err);
  //   }
  // },

  handleGetAllRentBookings: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = {
        status: req.query.status,
        userId: req.authenticateTokenDecoded.userId,
        role: req.authenticateTokenDecoded.role,
        page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
        sort: req.query.sort, // Default sort to -1 (descending)
      }
      console.log('Fetching Rent Bookings with Payload:', payload); // Debugging line to check payload
      const { data, total } = await RentBookingService.getAllBookings(payload as any);
      // res.status(200).json({
      //   status: 'success',
      //   message: 'All rent bookings retrieved successfully',
      //   data: bookings,
      // });
      res.status(200).json({
        status: 'success',
        message: `All rent bookings retrieved successfully`,
        totalContacts: total,
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(err);
    }
  },

  handleGetRentBookingById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log('Fetching Rent Booking by ID:', req.params.id); // Debugging line to check booking ID
      const booking = await RentBookingService.getBookingById(req.params.id);
      console.log('Fetched Rent Booking:', booking); // Debugging line to check fetched booking
      res.status(200).json({
        status: 'success',
        message: 'Rent booking fetched successfully',
        data: booking,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(err);
    }
  },

  handleGetGuestBooking: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.authenticateTokenDecoded;
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
      const { data, total } = await RentBookingService.handleGetGuestBooking(userId.toString(), page, limit);
      res.status(200).json({
        status: 'success',
        message: 'Rent booking fetched successfully',
        totalContacts: total,
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(err);
    }
  },

  handleGetRentByAllBooking: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const booking = await RentBookingService.handleGetRentByAllBooking(req.params.id);
      res.status(200).json({
        status: 'success',
        message: 'Rent booking fetched successfully',
        data: booking,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(err);
    }
  },

  handleUpdateRentBookingStatus: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status } = req.body;
      const updated = await RentBookingService.updateBookingStatus(req.params.id, status);
      res.status(200).json({
        status: 'success',
        message: 'Rent booking status updated successfully',
        data: updated,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(err);
    }
  },

  handleDeleteRentBooking: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await RentBookingService.deleteBooking(req.params.id);
      res.status(200).json({
        status: 'success',
        message: 'Rent booking delete successfully',
        data: result,
      });;
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(err);
    }
  },

  handleRentBookingHostEarning: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = {
        formMonth: req.query.formMonth as string,
        toMonth: req.query.toMonth as string,
        formYear: req.query.formYear as string,
        toYear: req.query.toYear as string,
        userId: req.authenticateTokenDecoded.userId,
        role: req.authenticateTokenDecoded.role,
      };
      console.log('Host Earning Payload:', payload); // Debugging line to check payload
      const stats = await RentBookingService.handleRentBookingHostEarning({ payload });
      res.status(200).json({
        status: 'success',
        message: 'Rent booking stats retrieved successfully',
        data: stats,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(err);
    }
  },

  handleAvailableRentStats: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const [list, count] = await Promise.all([
        RentBookingService.getAvailableRents(),
        RentBookingService.countAvailableRents(),
      ]);

      res.status(200).json({
        status: 'success',
        message: 'Available rents retrieved successfully',
        data: { count, list },
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(err);
    }
  },
  handlePaymentSuccess: async (req: Request, res: Response, next: NextFunction) => {
    console.log("Payment success request body:", req.body);
    console.log("Payment success query params:", req.query);

    const bookingId = req.query.tran_id || req.body.tran_id;
    const { val_id, amount, card_type, store_amount, bank_tran_id, status, ...rest } = req.body;

    try {
      if (!bookingId) {
        res.status(400).send("Missing bookingId/tran_id");
      }

      const booking = await RentBookingService.getBookingById(bookingId);

      if (booking) {
        booking.paymentStatus = "SUCCESS";
        booking.status = RentBookingStatus.CHECKED_IN;
        booking.transactionId = val_id || bank_tran_id || null;
        booking.paymentDetails = req.body;
        await booking.save();
        console.log("Payment successful for booking:", booking._id);
        const successUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success?bookingId=${booking._id}`;
        return  res.redirect(successUrl);
      } else {
        console.log("Booking not found for payment success:", bookingId);
        
      }
    } catch (err) {
      next(err);
    }
  },



  // handlePaymentSuccess: async (req: Request, res: Response, next: NextFunction) => {
  //   console.log("Payment success request body:", req.body); // Debugging line to check request body
  //   console.log("Payment success query params:", req.query); // Debugging line to check query params
  //   // Accept bookingId from query or tran_id from body
  //   const bookingId = req.query.tran_id || req.body.tran_id;
  //   const { val_id, amount, card_type, store_amount, bank_tran_id, status, ...rest } = req.body;
  //   try {
  //     if (!bookingId) {
  //       res.status(400).send("Missing bookingId/tran_id");
  //       return;
  //     }
  //     const booking = await RentBookingService.getBookingById(bookingId);
  //     if (booking) {
  //       booking.paymentStatus = 'SUCCESS';
  //       booking.status = RentBookingStatus.CHECKED_IN;
  //       booking.transactionId = val_id || bank_tran_id || null;
  //       booking.paymentDetails = req.body;
  //       await booking.save();
  //       console.log("Payment successful for booking:", booking._id);
  //       res.send("Payment successful! Booking updated.");
  //     } else {
  //       console.log("Booking not found for payment success:", bookingId);
  //       res.status(404).send("Booking not found.");
  //     }
  //   } catch (err) {
  //     next(err);
  //   }
  // }, 

  handlePaymentFail: async (req: Request, res: Response, next: NextFunction) => {
    const bookingId = req.query.tran_id || req.body.tran_id;
    try {
      if (!bookingId) {
        res.status(400).send("Missing bookingId/tran_id");
        return;
      }
      const booking = await RentBookingService.getBookingById(bookingId);
      if (booking) {
        booking.paymentStatus = 'FAILED';
        booking.status = RentBookingStatus.CANCELLED;
        booking.paymentDetails = req.body;
        await booking.save();
        console.log("booking failede status successfully failed",booking)
        const failedUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/payment-fail?bookingId=${booking._id}`;
        return  res.redirect(failedUrl);
      }
      console.log("Payment failed for booking:", bookingId);
      res.send("Payment failed.");
    } catch (err) {
      next(err);
    }
  },

  handlePaymentCancel: async (req: Request, res: Response, next: NextFunction) => {
    const bookingId = req.query.tran_id || req.body.tran_id;
    try {
      if (!bookingId) {
        res.status(400).send("Missing bookingId/tran_id");
        return;
      }
      const booking = await RentBookingService.getBookingById(bookingId);
      if (booking) {
        booking.paymentStatus = 'CANCELLED';
        booking.status = RentBookingStatus.CANCELLED;
        booking.paymentDetails = req.body;
        await booking.save();
        const cancelUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/payment-cancel?bookingId=${booking._id}`;
       return res.redirect(cancelUrl);
      }
      console.log("Payment cancelled for booking:", bookingId);
      res.send("Payment cancelled.");
    } catch (err) {
      next(err);
    }
  },

  handlePaymentIPN: async (req: Request, res: Response, next: NextFunction) => {
    const bookingId = req.query.tran_id || req.body.tran_id;
    const { status } = req.body;
    try {
      if (!bookingId) {
        res.status(400).send("Missing bookingId/tran_id");
        return;
      }
      const booking = await RentBookingService.getBookingById(bookingId);
      if (booking) {
        if (status === "VALID" || status === "VALIDATED") {
          booking.paymentStatus = 'SUCCESS';
          booking.status = RentBookingStatus.CHECKED_IN;
        } else if (status === "FAILED") {
          booking.paymentStatus = 'FAILED';
          booking.status = RentBookingStatus.CANCELLED;
        } else if (status === "CANCELLED") {
          booking.paymentStatus = 'CANCELLED';
          booking.status = RentBookingStatus.CANCELLED;
        }
        booking.paymentDetails = req.body;
        await booking.save();

        console.log("IPN received for booking:", bookingId);
        res.status(200).send("IPN received");
      } else {
        console.log("Booking not found for IPN:", bookingId);
        res.status(404).send("Booking not found.");
      }
    } catch (err) {
      next(err);
    }
  },

};

export default RentBookingController;
