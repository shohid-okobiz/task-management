
import { IBookingRentPayload } from './Booking.rent.interfaces';
import BookingRentRepositories from './booking.rent.repositories';


const {
  createNewBookingRent,
} = BookingRentRepositories;

const BookingRentServices = {

  createBookingRent: async ({ payload }: { payload: IBookingRentPayload }) => {
    try {
      const data = await createNewBookingRent(payload);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In initialize rent listing service');
      }
    }
  }

};

export default BookingRentServices;
