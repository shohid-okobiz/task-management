import { ILandBooking } from './landbooking.interfaces';
import LandBooking from './landbooking.models';


const LandBookingRepository = {
  create: async (data: ILandBooking) => {
    try {
      const booking = new LandBooking(data);
      await booking.save();
      return booking;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown error occurred while creating land booking.');
      }
    }
  },

  getAll: async (filter = {}) => {
    try {
      console.log("call this ");
      return await LandBooking.find(filter)
        .populate('land')
.populate({
  path: 'land',
  populate: [
    { path: 'category' },
    { path: 'host' }
  ]
})
        .populate({
          path: 'user',
          select: '-password',
        });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown error occurred while fetching land bookings.');
      }
    }
  },

  getById: async (id: string) => {
    try {
      return await LandBooking.findById(id)
        .populate('land')
        .populate({
          path: 'user',
          select: '-password',
        });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown error occurred while fetching land booking by ID.');
      }
    }
  },

  update: async (id: string, data: Partial<ILandBooking>) => {
    try {
      return await LandBooking.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown error occurred while updating land booking.');
      }
    }
  },

  delete: async (id: string) => {
    try {
      return await LandBooking.findByIdAndDelete(id);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown error occurred while deleting land booking.');
      }
    }
  },

  countByStatus: async () => {
    try {
      return await LandBooking.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown error occurred while counting land bookings by status.');
      }
    }
  },
  countAvailableLands: async () => {
    try {
      return await LandBooking.countDocuments({ status: 'available' });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown error occurred while counting available lands.');
      }
    }
  },

  getAvailableLands: async () => {
    try {
      return await LandBooking.find({ status: 'available' }).populate('land');
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown error occurred while fetching available lands.');
      }
    }
  },

};

export default LandBookingRepository;
