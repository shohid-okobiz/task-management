import { IFlatBooking } from './flatbooking.interfaces';
import FlatBooking from './flatbooking.models';

const FlatBookingRepository = {
    createBooking: async (data: IFlatBooking) => {
        try {
            const booking = new FlatBooking(data);
            await booking.save();
            return booking;
        } catch (error) {
            throw error instanceof Error
                ? error
                : new Error('Unknown error occurred while creating flat booking.');
        }
    },

    getAllBookings: async (filter = {}) => {
        try {
            return await FlatBooking.find(filter)
                .populate({
                    path: 'flat',
                    populate: {
                        path: 'host',
                        select: 'name email role', 
                    },
                })
                .populate({ path: 'user', select: '-password' });
        } catch (error) {
            throw error instanceof Error
                ? error
                : new Error('Unknown error occurred while fetching flat bookings.');
        }
    },


    getBookingById: async (id: string) => {
        try {
            return await FlatBooking.findById(id)
                .populate('flat')
                .populate({ path: 'user', select: '-password' });
        } catch (error) {
            throw error instanceof Error
                ? error
                : new Error('Unknown error occurred while fetching booking by ID.');
        }
    },

    updateBooking: async (id: string, data: Partial<IFlatBooking>) => {
        try {
            return await FlatBooking.findByIdAndUpdate(id, data, { new: true });
        } catch (error) {
            throw error instanceof Error
                ? error
                : new Error('Unknown error occurred while updating flat booking.');
        }
    },

    deleteBooking: async (id: string) => {
        try {
            return await FlatBooking.findByIdAndDelete(id);
        } catch (error) {
            throw error instanceof Error
                ? error
                : new Error('Unknown error occurred while deleting flat booking.');
        }
    },

    getBookingStats: async () => {
        try {
            return await FlatBooking.aggregate([
                { $group: { _id: '$status', count: { $sum: 1 } } },
            ]);
        } catch (error) {
            throw error instanceof Error
                ? error
                : new Error('Unknown error occurred while getting booking stats.');
        }
    },

    getAvailableFlats: async () => {
        try {
            return await FlatBooking.find({ status: 'available' }).populate('flat');
        } catch (error) {
            throw error instanceof Error
                ? error
                : new Error('Unknown error occurred while fetching available flats.');
        }
    },

    getSoldOutFlats: async () => {
        try {
            return await FlatBooking.find({ status: 'sold_out' }).populate('flat');
        } catch (error) {
            throw error instanceof Error
                ? error
                : new Error('Unknown error occurred while fetching sold-out flats.');
        }
    },

    countAvailableFlats: async () => {
        try {
            return await FlatBooking.countDocuments({ status: 'available' });
        } catch (error) {
            throw error instanceof Error
                ? error
                : new Error('Unknown error occurred while counting available flats.');
        }
    },

    countSoldOutFlats: async () => {
        try {
            return await FlatBooking.countDocuments({ status: 'sold_out' });
        } catch (error) {
            throw error instanceof Error
                ? error
                : new Error('Unknown error occurred while counting sold-out flats.');
        }
    },
};

export default FlatBookingRepository;
