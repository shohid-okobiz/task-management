import IFlat, {
  ICreateFlatPayload,
  IFlatPayload,
  IGetAllFlatPayload,
  IGetAllFlatQuery,
  IGetAllFlatRequestedQuery,
} from './flat.interfaces';
import FlatRepositories from './flat.repositories';
import { join } from 'path';
import { promises as fs } from 'fs';
import SlugUtils from '../../utils/slug.utils';

const { generateSlug } = SlugUtils;

const {
  initializeFlatListing,
  updateFlatListing,
  handleGetAllHostListedPropertiesForFlat,
  findAllListedFlat,
  deleteListedFlatItem,
  createNewFlat,
  findOneListedFlat,
  findOneListedFlatById,
  findOneHostListedStepFlatField,
  setFlatSelected
} = FlatRepositories;

const FlatServices = {
  processInitializeFlatListing: async ({ userId }: IFlatPayload) => {
    try {
      return await initializeFlatListing({ userId });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In initialize flat listing service');
      }
    }
  },
  processUpdateFlatListing: async ({ flatId, reqBody }: IFlatPayload) => {
    try {
      const { title } = reqBody as IFlat;
      if (title) (reqBody as IFlat).slug = generateSlug(title);
      return await updateFlatListing({ flatId, reqBody });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In update flat listing service');
      }
    }
  },
  processCreateFlat: async ({ images, payload }: ICreateFlatPayload) => {
    try {
      const {
        amenities,
        category,
        floorPlan,
        description,
        host,
        listingFor,
        price,
        location,
        title,
        buildingYear,
        video,
      } = payload as IFlat;
      const slug = generateSlug(title as string);
      const uploadedImages = images?.map((item) => `/public/${item}`) as string[];
      const postPayload: IFlat = {
        images: uploadedImages,
        coverImage: uploadedImages[0],
        amenities,
        category,
        floorPlan,
        description,
        host,
        listingFor,
        price,
        location,
        title,
        buildingYear,
        video,
        slug,
      };
      const data = await createNewFlat(postPayload);
      return data;
    } catch (error) {
      const filePaths = images?.map((item) => join(__dirname, '../../../public', item));
      filePaths?.map((item) => fs.unlink(item));
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In rent listing image upload service');
      }
    }
  },
  processUploadImage: async ({ flatId, images }: IFlatPayload) => {
    try {
      const uploadedImages = images?.map((item) => `/public/${item}`) as string[];
      const reqBody: IFlat = {
        images: uploadedImages,
        coverImage: uploadedImages[0],
      };
      return await updateFlatListing({ flatId, reqBody });
    } catch (error) {
      const filePaths = images?.map((item) => join(__dirname, '../../../public', item));
      filePaths?.map((item) => fs.unlink(item));
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In upload image service');
      }
    }
  },
  processUnlinkImage: async ({ singleImage, images, flatId }: IFlatPayload) => {
    const image = singleImage as String;
    const relativeImagePath = image.replace('/public/', '');
    const filePath = join(__dirname, '../../../public', relativeImagePath);
    try {
      const reqBody: IFlat = {};
      if (images) {
        reqBody.coverImage = images[0];
        reqBody.images = images;
      }
      await Promise.all([fs.unlink(filePath), updateFlatListing({ reqBody, flatId })]);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In unlink flat listing image service');
      }
    }
  },
  handleGetAllHostListedPropertiesForFlat: async ({ userId, page, limit }: IFlatPayload) => {
    try {
      return await handleGetAllHostListedPropertiesForFlat({ userId, page, limit });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In unlink flat listing image service');
      }
    }
  },
  processGetAllListedFlat: async ({
    category,
    isSold,
    search,
    page,
    publishStatus,
    sort,
    location,
    minPrice,
    maxPrice,
    limit,
  }: IGetAllFlatRequestedQuery) => {
    try {
      const query: IGetAllFlatQuery = {};

      if (search) query.email = String(search);
      if (isSold !== undefined) query.isSold = isSold;
      if (category) query.category = String(category);
      if (publishStatus) query.publishStatus = publishStatus;
      if (location) {
        query.location = {
          $regex: location,
          $options: 'i',
        }
      }
      if (minPrice !== undefined || maxPrice !== undefined) {
        query.price = {};
        if (minPrice !== undefined) query.price.$gte = Number(minPrice);
        if (maxPrice !== undefined) query.price.$lte = Number(maxPrice);
      }

      const payload: IGetAllFlatPayload = { query };
      if (page) payload.page = page;
      if (sort) payload.sort = sort;
      if (limit) payload.limit = limit; 
      return await findAllListedFlat(payload);
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error("Unknown Error Occurred in get all listed flat service");
    }
  },

  processRetrieveOneListedFlat: async ({ slug }: IFlatPayload) => {
    try {
      return await findOneListedFlat({ slug });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Retrieve One Listed Flat Service');
      }
    }
  },
  processRetrieveOneListedFlatById: async ({ flatId }: IFlatPayload) => {
    try {
      return await findOneListedFlatById({ flatId });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Retrieve One Listed Flat Service');
      }
    }
  },
  processChangeStatus: async ({ flatId, reqBody }: IFlatPayload) => {
    try {
      const data = await updateFlatListing({ flatId, reqBody });
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In change status service');
      }
    }
  },
  processDeleteListedFlatItem: async ({ flatId }: IFlatPayload) => {
    try {
      const { images } = (await deleteListedFlatItem({ flatId })) as IFlat;
      if (images !== null) {
        const relativeImagePath = images?.map((item) => item.replace('/public/', ''));
        const filePaths = relativeImagePath?.map((item) =>
          join(__dirname, '../../../public', item)
        );
        await Promise.all([filePaths?.map((item) => fs.unlink(item))]);
        return;
      }
      return;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In delete listed flat item service');
      }
    }
  },
  processGetFlatField: async ({ id, field }: { id: string; field: string }) => {
    try {
      const data = await findOneHostListedStepFlatField({ id, field });
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Retrieve One Listed Flat Service');
      }

    }

  },
   processSetFlattSelected : async ({ id, selected }: { id: string, selected: boolean }) => {
    try {
      const data= await setFlatSelected({ id, selected });
      return data;
    } catch (error) {
      if (error instanceof Error) {
          throw error;
        } else {
          throw new Error('Unknown Error Occurred In Retrieve One Listed Rent Service');
        }
    }
  }
};

export default FlatServices;
