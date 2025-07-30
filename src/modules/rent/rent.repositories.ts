import mongoose, { Types } from 'mongoose';
import { documentPerPage } from '../../const';
import User from '../user/user.model';
import IRent, { IGetAllRentPayload, IRentPayload, RentListingStatus } from './rent.interfaces';
import Rent from './rent.models';
import Blockdate from './blockDate.models';
import RentBooking from '../rentbooking/rentbooking.models';
const RentRepositories = {
  initializedRentListing: async ({ host, payload }: IRentPayload) => {
    try {
      const { listingFor } = payload as IRent;
      const data = new Rent({ host, listingFor });
      await data.save();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Rent Initialized Operation');
      }
    }
  },
  creatingRentListingById: async ({ payload, rentId }: IRentPayload) => {
    try {
      const rent = await Rent.findById(rentId);
      const { price } = payload as IRent;
      if (!price) {
        const data = await Rent.findByIdAndUpdate(rentId, payload, {
          new: true,
          runValidators: true,
        });
        return data;
      } else {
        if (
          rent?.status === RentListingStatus.PUBLISHED ||
          rent?.status === RentListingStatus.PENDING
        ) {
          const data = await Rent.findByIdAndUpdate(
            rentId,
            {
              $set: {
                price,
              },
            },
            {
              new: true,
              runValidators: true,
            }
          );
          return data;
        }
        const data = await Rent.findByIdAndUpdate(
          rentId,
          {
            $set: {
              price,
              status: RentListingStatus.PENDING,
            },
          },
          {
            new: true,
            runValidators: true,
          }
        );
        return data;
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Rent Update Operation');
      }
    }
  },
  findOneWithHostAndRentId: async ({ host, rentId }: IRentPayload) => {
    try {
      const data = await Rent.findOne({ host, _id: rentId });
      if (!data) return null;
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Get One Rent Properties Operation');
      }
    }
  },
  findOneListedRent: async ({ slug }: IRentPayload) => {
    try {
      return await Rent.findOne({ slug })
        .populate('host')
        .populate('listingFor')
        .populate('category')
        .populate('amenities');
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Find One Listed Rent Operation');
      }
    }
  },
  findOneListedRentById: async ({ rentId }: IRentPayload) => {
    try {
      return await Rent.findOne({ rentId })
        .populate('host')
        .populate('listingFor')
        .populate('category')
        .populate('amenities');
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Find One Listed Rent Operation');
      }
    }
  },
  processHostListedRentProperties: async ({ host, page, limit }: IRentPayload) => {
    try {
      const PerPage = limit ?? documentPerPage;
      const currentPage = page ?? 1;
      const skip = (currentPage - 1) * (limit ?? PerPage);
      const [data, total] = await Promise.all([
        Rent.find({ host })
          .skip(skip)
          .limit(PerPage)
          .sort({ createdAt: -1 })
          .populate('host')
          .populate('listingFor')
          .populate('category')
          .populate('amenities'),
        Rent.countDocuments({ host }),
      ]);
      return { data, total };
      // const data = await Rent.find({ host });
      // if (!data) return null;
      // return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Get Rent Properties For Host Operation');
      }
    }
  },
  createNewRent: async (payload: IRent) => {
    try {
      const newRent = new Rent(payload);
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
  findAllListedRent: async ({ query, page, sort }: IGetAllRentPayload) => {
    try {
      const currentPage = page ?? 1;
      const skip = (currentPage - 1) * documentPerPage;
      // const sortOption: Record<string, 1 | -1> | undefined =
      //   sort === 1 || sort === -1 ? { createdAt: sort } : undefined;
      const sortValue = Number(sort);
      const sortOption: Record<string, 1 | -1> =
        sortValue === 1 || sortValue === -1
          ? { createdAt: sortValue as 1 | -1 }
          : { createdAt: -1 };
      if (query.email) {
        const host = await User.findOne({ email: query.email });
        if (host) {
          query.host = host._id as Types.ObjectId;
          delete query.email;
        } else {
          return { data: [], total: 0 };
        }
      }
      const [data, total] = await Promise.all([
        Rent.find(query)
          .skip(skip)
          .limit(documentPerPage)
          .sort(sortOption)
          .populate('host')
          .populate('listingFor')
          .populate('category')
          .populate('amenities'),
        Rent.countDocuments(query),
      ]);
      return { data, total };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Get All Listed Rent Operation');
      }
    }
  },
  deleteListedRentItem: async ({ rentId }: IRentPayload) => {
    try {
      const data = await Rent.findByIdAndDelete(rentId);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In delete listed rent item Operation');
      }
    }
  },
  findOneHostListedStepField: async ({ id, field }: { id: string, field: string }) => {
    try {
      const data = await Rent.findById(id).lean();

      if (!data) {
        throw new Error('Rent listing data not found');
      }

      if (!(field in data)) {
        throw new Error(`Field "${field}" does not exist in rent document`);
      }

      return data

    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In delete listed rent item Operation');
      }

    }
  },
  findAllSearchingRent: async ({ query, page, sort, limit }: IGetAllRentPayload) => {
    console.log('findAllSearchingRent ----------------', query, page, sort, limit);
    try {
      const {
        location,
        checkinDate,
        checkoutDate,
        bedroomCount,
        bathCount,
        bedCount,
        guestCount,
        status,
        category,
      } = query;

      const PerPage = limit ?? documentPerPage;
      const currentPage = page ?? 1;
      // const sortOption: Record<string, 1 | -1> | undefined =
      //   sort === 1 || sort === -1 ? { createdAt: sort } : undefined;
      const sortValue = Number(sort);
      const sortOption: Record<string, 1 | -1> =
        sortValue === 1 || sortValue === -1
          ? { createdAt: sortValue as 1 | -1 }
          : { createdAt: -1 };

      // Build the MongoDB query
      const mongoQuery: any = {};
      if (status && status !== "") {
        mongoQuery.status = status;
      }

      if (location) {
        mongoQuery.location = { $regex: location, $options: 'i' };
      }

      if (checkinDate && checkoutDate) {
        mongoQuery.checkinDate = { $lte: new Date(checkinDate) };
        mongoQuery.checkoutDate = { $gte: new Date(checkoutDate) };
      }


      if (bedroomCount) mongoQuery['floorPlan.bedroomCount'] = { $gte: +bedroomCount };
      if (bathCount) mongoQuery['floorPlan.bathCount'] = { $gte: +bathCount };
      if (bedCount) mongoQuery['floorPlan.bedCount'] = { $gte: +bedCount };
      if (guestCount) mongoQuery['floorPlan.guestCount'] = { $gte: +guestCount };
      if (category) {
        mongoQuery.category = category;
      }
      console.log("sortOption", sortOption);
      const allRents = await Rent.find(mongoQuery)
        .sort(sortOption)
        .populate('host')
        .populate('listingFor')
        .populate('category')
        .populate('amenities');

      // Filter by booking conflicts (if checkin/checkout given)
      // const availableRents: any[] = [];
      // for (const rent of allRents) {
      //   const bookingExists = await RentBooking.findOne({
      //     rent: rent._id,
      //     ...(checkoutDate && { checkinDate: { $lte: new Date(checkoutDate) } }),
      //     ...(checkinDate && { checkoutDate: { $gte: new Date(checkinDate) } }),
      //     status: { $nin: ['cancelled', 'rejected'] },
      //   });

      //   if (!bookingExists) {
      //     availableRents.push(rent);
      //   }
      // }

      const total = allRents.length;
      const paginated = allRents.slice((currentPage - 1) * PerPage, currentPage * PerPage);

      return {
        data: paginated,
        total,
        totalPages: Math.ceil(total / PerPage),
      };
    } catch (error) {
      throw new Error('Error occurred while searching rent listings');
    }
  },

  handleRentDateBlockList: async ({ host, payload }: { host: string, payload: any }) => {
    try {
      const { rentId, date } = payload;
      console.log('handleRentDateBlockList', { host, rentId, date });
      const rent = await Rent.findOne({ _id: rentId, host });
      if (!rent) {
        throw new Error('Rent not found or you do not have permission to block dates for this rent');
      }
      // Check if this date is already booked in RentBooking
      const bookingExists = await RentBooking.findOne({
        rent: rent._id,
        checkinDate: { $lte: new Date(date) },
        checkoutDate: { $gte: new Date(date) },
        status: { $nin: ['cancelled', 'rejected'] }, // Only consider active bookings
      });

      if (bookingExists) {
        throw new Error('This date is already booked and cannot be blocked.');
      }
      // If only a single date is provided, block/unblock that date
      const blockDate = new Date(date);

      // Check if the block date already exists
      const existing = await Blockdate.findOne({
        rent: rent._id,
        blockDate: blockDate
      });

      if (existing) {
        // If already blocked, remove (unblock) it
        await Blockdate.deleteOne({ _id: existing._id });
        return { message: 'Date unblocked successfully', date: blockDate };
      }

      // Create the block date
      const createdBlockDate = await Blockdate.create({
        rent: rent._id,
        blockDate: blockDate
      });

      return createdBlockDate;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Rent Date Block List Operation');
      }
    }
  },

  handleGetRentDateBlockList: async ({ payload }: { payload: any }) => {
    try {
      const { rentId } = payload;
      let filter: any = {};
      if (rentId) {
        filter.rent = rentId;
      }
      const blockDates = await Blockdate.find(filter).sort({ blockDate: 1 });

      return blockDates;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Get Rent Date Block List Operation');
      }
    }
  },
  setRentSelected: async ({ id, selected }: { id: string, selected: boolean }) => {
    try {
      // Count currently selected items
      const selectedCount = await Rent.countDocuments({ selected: true });
      if (selected && selectedCount >= 9) {
        throw new Error('You can select a maximum of 9 items.');
      }
      const updated = await Rent.findByIdAndUpdate(
        id,
        { selected },
        { new: true }
      );
      return updated;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Get Rent  List select Operation');
      }
    }
  },


};

export default RentRepositories;
