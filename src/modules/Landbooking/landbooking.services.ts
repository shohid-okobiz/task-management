import { ILandBooking, LandBookingStatus } from './landbooking.interfaces';
import LandBookingRepository from './landbooking.repositories';

const LandBookingService = {
  createBooking: async (data: ILandBooking) => {
    try {
      return await LandBookingRepository.create(data);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unknown Error Occurred In Create Land Booking Service');
    }
  },

  getAllBookings: async () => {
    try {
      return await LandBookingRepository.getAll();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unknown Error Occurred In Get All Land Bookings Service');
    }
  },

  getBookingById: async (id: string) => {
    try {
      return await LandBookingRepository.getById(id);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unknown Error Occurred In Get Land Booking By ID Service');
    }
  },

  updateBookingStatus: async (id: string, status: LandBookingStatus) => {
    try {
      return await LandBookingRepository.update(id, { status });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unknown Error Occurred In Update Land Booking Status Service');
    }
  },

  deleteBooking: async (id: string) => {
    try {
      return await LandBookingRepository.delete(id);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unknown Error Occurred In Delete Land Booking Service');
    }
  },

  getBookingStats: async () => {
    try {
      return await LandBookingRepository.countByStatus();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unknown Error Occurred In Get Land Booking Stats Service');
    }
  },

  getAvailableLands: async () => {
    try {
      return await LandBookingRepository.getAvailableLands();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unknown Error Occurred In Get Available Lands Service');
    }
  },

  countAvailableLands: async () => {
    try {
      return await LandBookingRepository.countAvailableLands();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unknown Error Occurred In Count Available Lands Service');
    }
  },
};

export default LandBookingService;
