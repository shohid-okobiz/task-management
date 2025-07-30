
import { Types } from 'mongoose';
import { IBookingRentPayload } from './Booking.rent.interfaces';
import BookingRent from './booking.rent.models';

const BookingRentRepositories = {
  createNewBookingRent: async (payload: IBookingRentPayload) => {
    try {
      const booking = await BookingRent.find({ rent_id: new Types.ObjectId(payload.rent_id), checkOut: payload.checkout });
      if (booking.length > 0) {
        throw new Error('Booking already found');
      }
      const newRent = new BookingRent(payload);
      await newRent.save();
      return newRent;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Rent Creation Operation');
      }
    }
  },


};

export default BookingRentRepositories;
