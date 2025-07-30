import FlatBookingRepository from './flatbooking.repository';
import { FlatBookingStatus, IFlatBooking } from './flatbooking.interfaces';

const FlatBookingService = {
  createBooking: async (data: IFlatBooking) => {
    try {
      return await FlatBookingRepository.createBooking(data);
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error('Unknown error occurred in createBooking service.');
    }
  },

  getAllBookings: async () => {
    try {
      return await FlatBookingRepository.getAllBookings();
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error('Unknown error occurred in getAllBookings service.');
    }
  },

  getBookingById: async (id: string) => {
    try {
      return await FlatBookingRepository.getBookingById(id);
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error('Unknown error occurred in getBookingById service.');
    }
  },

  updateBookingStatus: async (id: string, status: FlatBookingStatus)=> {
    try {
      return await FlatBookingRepository.updateBooking(id, { status });
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error('Unknown error occurred in updateBookingStatus service.');
    }
  },

  deleteBooking: async (id: string) => {
    try {
      return await FlatBookingRepository.deleteBooking(id);
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error('Unknown error occurred in deleteBooking service.');
    }
  },

  getBookingStats: async () => {
    try {
      return await FlatBookingRepository.getBookingStats();
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error('Unknown error occurred in getBookingStats service.');
    }
  },

  getAvailableFlats: async () => {
    try {
      return await FlatBookingRepository.getAvailableFlats();
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error('Unknown error occurred in getAvailableFlats service.');
    }
  },

  getSoldOutFlats: async () => {
    try {
      return await FlatBookingRepository.getSoldOutFlats();
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error('Unknown error occurred in getSoldOutFlats service.');
    }
  },

  countAvailableFlats: async () => {
    try {
      return await FlatBookingRepository.countAvailableFlats();
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error('Unknown error occurred in countAvailableFlats service.');
    }
  },

  countSoldOutFlats: async () => {
    try {
      return await FlatBookingRepository.countSoldOutFlats();
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error('Unknown error occurred in countSoldOutFlats service.');
    }
  },
};

export default FlatBookingService;
