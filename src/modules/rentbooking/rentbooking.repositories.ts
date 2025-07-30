import Rent from '../rent/rent.models';
import { IRentBooking } from './rentbooking.interfaces';
import RentBooking from './rentbooking.models';


const RentBookingRepository = {
  createBooking: async (payload: IRentBooking) => {
    try {
      // Validate required fields

      const { rent, checkinDate, checkoutDate, guestCount, user } = payload;
      console.log("payload in createBooking:", payload); // Debugging line to check payload
      if (!rent || !checkinDate || !checkoutDate || !guestCount || !user) {
        throw new Error('Missing required fields for rent booking.');
      }
      // chekc if rent is valid data in rent collection
      const rentExists = await Rent.findById(rent);
      if (!rentExists) {
        throw new Error('Rent does not exist.');
      }
      const existingBooking = await RentBooking.findOne({
        rent: payload.rent,
        $or: [
          { checkinDate: { $lte: payload.checkoutDate, $gte: payload.checkinDate } },
          { checkoutDate: { $gte: payload.checkinDate, $lte: payload.checkoutDate } },
        ],
      });
      if (existingBooking) {
        throw new Error('Rent is not available for the selected dates.');
      }
      // price calculation
      if (typeof rentExists.price !== 'number') {
        throw new Error('Rent price is not defined.');
      }
      // checkin and checkout date difference count 
      const checkin = new Date(checkinDate);
      const checkout = new Date(checkoutDate);
      if (checkout <= checkin) {
        throw new Error('Checkout date must be after checkin date.');
      }
      // day difference calculation
      const dayDifference = Math.ceil((checkout.getTime() - checkin.getTime()) / (1000 * 3600 * 24));
      if (dayDifference <= 0) {
        throw new Error('Invalid date range. Checkout date must be after checkin date.');
      }
      payload.price = rentExists.price * dayDifference;
      payload.rentHost = rentExists.host; // Assuming rent host is the user who owns the rent property
      console.log("payload in createBooking 00000:", payload); // Debugging line to check payload before saving
      const booking = new RentBooking(payload);
      await booking.save();
      return booking;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown error occurred while creating rent booking.');
      }
    }
  },

  getAllBookings: async (payload: IRentBooking) => {
    try {
      const { status, userId, role, page, limit, sort } = payload;
      const currentPage = page ?? 1;
      const itemsPerPage = limit ?? 10;
      const skip = (currentPage - 1) * itemsPerPage;
      // const sortOption: Record<string, 1 | -1> | undefined =
      //   sort === 1 || sort === -1 ? { createdAt: sort } : undefined;
      const sortValue = Number(sort);
        const sortOption: Record<string, 1 | -1> =
  sortValue === 1 || sortValue === -1
    ? { createdAt: sortValue as 1 | -1 }
    : { createdAt: -1 };
      const filter: any = {};
      if (status) {
        filter.status = status;
      }
      if (role === 'host' && userId) {
        filter.rentHost = userId; // Filter by rent host if the user is a
        // host
      } else if (role === 'user' && userId) {
        filter.user = userId; // Filter by user if the user is a regular user
      }
      console.log('Fetching rent bookings with filter:', filter); // Debugging line to check filter
      // return await RentBooking.find(filter)
      //   .skip(skip)
      //   .limit(itemsPerPage)
      //   .populate('rent')
      //   .populate('rentHost', '-password')
      //   .populate({
      //     path: 'user',
      //     select: '-password',
      //   });
      const [data, total] = await Promise.all([
        RentBooking.find(filter)
          .skip(skip)
          .limit(itemsPerPage)
                    .sort(sortOption)
          .populate('rent')
          .populate('rentHost', '-password')
          .populate({
            path: 'user',
            select: '-password',
          }),
        RentBooking.countDocuments(filter),
      ]);
      return { data, total };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown error occurred while fetching rent bookings.');
      }
    }
  },

  getById: async (id: string) => {
    try {
      return await RentBooking.findById(id)
        .populate('rent')
        .populate('rentHost', '-password')
        .populate({
          path: 'user',
          select: '-password',
        });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown error occurred while fetching rent booking by ID.');
      }
    }
  },

  handleGetGuestBooking: async (userId: string, page: number, limit: number) => {
    try {
      // return await RentBooking.find({ user: userId })
      //   .populate('rent')
      //   .populate('rentHost', '-password')
      //   .populate({
      //     path: 'user',
      //     select: '-password',
      //   });
            const currentPage = page ?? 1;
      const itemsPerPage = limit ?? 10;
      const skip = (currentPage - 1) * itemsPerPage;
            const [data, total] = await Promise.all([
        RentBooking.find({ user: userId })
          .skip(skip)
          .limit(itemsPerPage)
            .populate('rent')
        .populate('rentHost', '-password')
        .populate({
          path: 'user',
          select: '-password',
        }),
        RentBooking.countDocuments({ user: userId }),
      ]);
      return { data, total };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown error occurred while fetching rent booking by ID.');
      }
    }
  },

  handleGetRentByAllBooking: async (id: string) => {
    try {
      return await RentBooking.find({ rent: id })
        .populate('rent')
        .populate('rentHost', '-password')
        .populate({
          path: 'user',
          select: '-password',
        });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown error occurred while fetching rent booking by ID.');
      }
    }
  },

  updateBookingStatus: async (id: string, data: Partial<IRentBooking>) => {
    try {
      // Validate required fields
      if (!data.status) {
        throw new Error('Status is required to update rent booking.');
      }
      // Check if the booking exists
      const bookingExists = await RentBooking.findById(id);
      if (!bookingExists) {
        throw new Error('Rent booking does not exist.');
      }
      console.log('Updating rent booking with data:', data); // Debugging line to check update data
      return await RentBooking.findByIdAndUpdate(id, { ...data, updateRole: "admin" }, { new: true });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown error occurred while updating rent booking.');
      }
    }
  },

  deleteBooking: async (id: string) => {
    try {
      const data = await RentBooking.findByIdAndDelete(id);
      if (!data) {
        throw new Error('Rent booking does not exist.');
      }
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown error occurred while deleting rent booking.');
      }
    }
  },

  handleRentBookingHostEarning: async ({ payload }: { payload: { formDate: string; toDate: string; userId: string } }) => {
    try {
      const { formDate, toDate, userId } = payload;

      // Ensure toDate is after formDate
      if (toDate <= formDate) {
        throw new Error('toDate must be after formDate.');
      }
      // Calculate total earnings for the host within the specified date range
      console.log('Calculating total earnings for host:', userId, 'from', formDate, 'to', toDate); // Debugging line


      const totalEarnings = await RentBooking.find({
        rentHost: userId,
        status: 'checked_out',
        checkinDate: { $gte: formDate },
        checkoutDate: { $lte: toDate },
      }).populate('rent').populate('rentHost', '-password')
        .populate({
          path: 'user',
          select: '-password',
        })
        .select('price checkinDate checkoutDate rent')
        .sort({ checkinDate: 1 }); // Sort by checkinDate for better readability

      console.log('Total earnings calculated:', totalEarnings); // Debugging line
      if (!totalEarnings || totalEarnings.length === 0) {
        return { totalEarnings: 0, bookings: [] };
      }
      const earnings = totalEarnings.reduce((acc, booking) => acc + (booking.price ?? 0), 0);
      console.log('Total earnings:', earnings); // Debugging line
      return { totalEarnings: earnings, bookings: totalEarnings };


    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown error occurred while calculating host earnings.');
      }

    }
  },
  countAvailableRents: async () => {
    try {
      return await RentBooking.countDocuments({ status: 'available' });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown error occurred while counting available rents.');
      }
    }
  },

  getAvailableRents: async () => {
    try {
      return await RentBooking.find({ status: 'available' }).populate('rent');
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown error occurred while fetching available rents.');
      }
    }
  },

};

export default RentBookingRepository;
