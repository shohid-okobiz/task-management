import { Types } from 'mongoose';
import { documentPerPage } from '../../const';
import User from '../user/user.model';
import IFlat, { IFlatPayload, IGetAllFlatPayload, ListingPublishStatus } from './flat.interfaces';
import Flat from './flat.models';

const FlatRepositories = {
  initializeFlatListing: async ({ userId }: IFlatPayload) => {
    try {
      const data = new Flat({ host: userId });
      await data.save();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Flat Initialized Operation');
      }
    }
  },
  updateFlatListing: async ({ flatId, reqBody }: IFlatPayload) => {
    try {
      const flat = await Flat.findById(flatId);
      const { price } = reqBody as IFlat;
      if (!price) {
        return await Flat.findByIdAndUpdate(flatId, reqBody, {
          new: true,
          runValidators: true,
        });
      } else {
        if (
          flat?.publishStatus === ListingPublishStatus.PUBLISHED ||
          flat?.publishStatus === ListingPublishStatus.PENDING
        ) {
          return await Flat.findByIdAndUpdate(
            flatId,
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
        }
        return await Flat.findByIdAndUpdate(
          flatId,
          {
            $set: {
              price,
              publishStatus: ListingPublishStatus.PENDING,
            },
          },
          {
            new: true,
            runValidators: true,
          }
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Flat Initialized Operation');
      }
    }
  },
  handleGetAllHostListedPropertiesForFlat: async ({ userId, page, limit }: IFlatPayload) => {
    try {
      const PerPage = limit ?? documentPerPage;
      const currentPage = page ?? 1;
      const skip = (currentPage - 1) * (limit ?? PerPage);
      const [data, total] = await Promise.all([
        Flat.find({ host: userId })
          .skip(skip)
          .limit(PerPage)
          .sort({ createdAt: -1 })
          .populate('host')
          .populate('listingFor')
          .populate('category')
          .populate('amenities'),
        Flat.countDocuments({ host: userId }),
      ]);
      return { data, total };
      // const data = await Flat.find({ host: userId });
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
  findAllListedFlat: async ({ query, page, sort, limit }: IGetAllFlatPayload) => {
    try {
      const currentPage = page ?? 1;
      const perPage = limit ?? documentPerPage;
      const skip = (currentPage - 1) * perPage;

      const sortOption: Record<string, 1 | -1> | undefined =
        sort === 1 || sort === -1 ? { createdAt: sort } : undefined;

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
        Flat.find(query)
          .skip(skip)
          .limit(perPage)
          .sort(sortOption)
          .populate("host")
          .populate("listingFor")
          .populate("category")
          .populate("amenities"),
        Flat.countDocuments(query),
      ]);

      return { data, total };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown Error Occurred In Get All Listed Flat Operation");
      }
    }
  },

  // findAllListedFlat: async ({ query, page, sort }: IGetAllFlatPayload) => {
  //   try {
  //     const currentPage = page ?? 1;
  //     const skip = (currentPage - 1) * documentPerPage;
  //     const sortOption: Record<string, 1 | -1> | undefined =
  //       sort === 1 || sort === -1 ? { createdAt: sort } : undefined;
  //     if (query.email) {
  //       const host = await User.findOne({ email: query.email });
  //       if (host) {
  //         query.host = host._id as Types.ObjectId;
  //         delete query.email;
  //       } else {
  //         return { data: [], total: 0 };
  //       }
  //     }
  //     const [data, total] = await Promise.all([
  //       Flat.find(query)
  //         .skip(skip)
  //         .limit(documentPerPage)
  //         .sort(sortOption)
  //         .populate('host')
  //         .populate('listingFor')
  //         .populate('category'),
  //       Flat.countDocuments(query),
  //     ]);
  //     return { data, total };
  //   } catch (error) {
  //     if (error instanceof Error) {
  //       throw error;
  //     } else {
  //       throw new Error('Unknown Error Occurred In Get All Listed Flat Operation');
  //     }
  //   }
  // },
  findOneListedFlat: async ({ slug }: IFlatPayload) => {
    try {
      return await Flat.findOne({ slug })
        .populate('host')
        .populate('listingFor')
        .populate('category');
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Find One Listed Flat Operation');
      }
    }
  },
  findOneListedFlatById: async ({ flatId }: IFlatPayload) => {
    try {
      return await Flat.findOne({ flatId })
        .populate('host')
        .populate('listingFor')
        .populate('category');
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Find One Listed Flat Operation');
      }
    }
  },
  createNewFlat: async (payload: IFlat) => {
    try {
      const newRent = new Flat(payload);
      await newRent.save();
      return newRent;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Flat Creation Operation');
      }
    }
  },
  deleteListedFlatItem: async ({ flatId }: IFlatPayload) => {
    try {
      const data = await Flat.findByIdAndDelete(flatId);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In delete listed flat item Operation');
      }
    }
  },
  findOneHostListedStepFlatField: async ({ id, field }: { id: string, field: string }) => {
    try {
      const data = await Flat.findById(id).lean();

      if (!data) {
        throw new Error('Flat listing data not found');
      }

      if (!(field in data)) {
        throw new Error(`Field "${field}" does not exist in Flat document`);
      }

      return data

    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In delete listed Flat item Operation');
      }

    }
  },
  setFlatSelected: async ({ id, selected }: { id: string, selected: boolean }) => {
    try {

      const selectedCount = await Flat.countDocuments({ selected: true });
      if (selected && selectedCount >= 9) {
        throw new Error('You can select a maximum of 9 items.');
      }
      const updated = await Flat.findByIdAndUpdate(
        id,
        { selected },
        { new: true }
      );
      return updated;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Get Flat  List select Operation');
      }
    }
  },
};

export default FlatRepositories;
