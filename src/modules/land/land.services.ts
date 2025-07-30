import ILand, {
  ICreateLandPayload,
  IGetAllLandPayload,
  IGetAllLandQuery,
  IGetAllLandRequestedQuery,
  ILandPayload,
} from './land.interfaces';
import LandRepositories from './land.repositories';
import { join } from 'path';
import { promises as fs } from 'fs';
import SlugUtils from '../../utils/slug.utils';

const { generateSlug } = SlugUtils;

const {
  deleteListedLandItem,
  findAllForHost,
  findAllListedLand,
  initializeLandListing,
  updateLandListing,
  createNewLand,
  findOneListedLand,
  findOneByIdListedLand,
  findOneHostListedStepLandField,
  setLandSelected

} = LandRepositories;

const LandServices = {
  processRetrieveOneListedLand: async ({ slug }: ILandPayload) => {
    try {
      return await findOneListedLand({ slug });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Retrieve One Listed Land service');
      }
    }
  },
  processRetrieveOneListedLandById: async ({ landId }: ILandPayload) => {
    try {
      return await findOneByIdListedLand({ landId });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Retrieve One Listed Land service');
      }
    }
  },
  processInitializeLandListing: async ({ userId }: ILandPayload) => {
    try {
      return await initializeLandListing({ userId });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In initialize land listing service');
      }
    }
  },
  processUpdateLandListing: async ({ landId, reqBody }: ILandPayload) => {
    try {
      const { title } = reqBody as ILand;
      if (title) (reqBody as ILand).slug = generateSlug(title);
      return await updateLandListing({ landId, reqBody });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In update land listing service');
      }
    }
  },
  processCreateLand: async ({ images, payload }: ICreateLandPayload) => {
    try {
      const { category, description, host, listingFor, price, location, title, video, landSize } =
        payload as ILand;
      const slug = generateSlug(title as string);
      const uploadedImages = images?.map((item) => `/public/${item}`) as string[];
      const postPayload: ILand = {
        images: uploadedImages,
        coverImage: uploadedImages[0],
        category,
        description,
        host,
        listingFor,
        price,
        location,
        title,
        video,
        landSize,
        slug,
      };
      const data = await createNewLand(postPayload);
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
  processChangeStatus: async ({ landId, reqBody }: ILandPayload) => {
    try {
      const data = await updateLandListing({ landId, reqBody });
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In change status service');
      }
    }
  },
  processUploadImage: async ({ landId, images }: ILandPayload) => {
    try {
      const uploadedImages = images?.map((item) => `/public/${item}`) as string[];
      const reqBody: ILand = {
        images: uploadedImages,
        coverImage: uploadedImages[0],
      };
      return await updateLandListing({ landId, reqBody });
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
  processUnlinkImage: async ({ singleImage, images, landId }: ILandPayload) => {
    const image = singleImage as String;
    const relativeImagePath = image.replace('/public/', '');
    const filePath = join(__dirname, '../../../public', relativeImagePath);
    try {
      const reqBody: ILand = {};
      if (images) {
        reqBody.coverImage = images[0];
        reqBody.images = images;
      }
      await Promise.all([fs.unlink(filePath), updateLandListing({ reqBody, landId })]);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In unlink land listing image service');
      }
    }
  },
  processHostListedLandProperties: async ({ userId, page, limit }: ILandPayload) => {
    try {
      return await findAllForHost({ userId, page, limit });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In unlink land listing image service');
      }
    }
  },
  processGetAllListedLand: async ({
    page,
    publishStatus,
    sort,
    isSold,
    search,
    category,
    location,
    minPrice,
    maxPrice,
    limit,
  }: IGetAllLandRequestedQuery) => {
    try {
      const query: IGetAllLandQuery = {};

      if (publishStatus) query.publishStatus = String(publishStatus);
      if (isSold !== undefined) query.isSold = isSold;
      if (category) query.category = String(category);
      if (location) query.location = String(location);
      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
      }
      if (search) query.email = String(search);

      const payload: IGetAllLandPayload = { query, page, sort };
      if (limit) payload.limit = limit; 
      return await findAllListedLand(payload);
    } catch (error) {
      throw new Error('Unknown Error Occurred get all listed land service');
    }
  },
  // processGetAllListedLand: async ({
  //   page,
  //   publishStatus,
  //   sort,
  //   isSold,
  //   search,
  //   category,
  // }: IGetAllLandRequestedQuery) => {
  //   try {
  //     const query: IGetAllLandQuery = {};
  //     if (publishStatus) query.publishStatus = String(publishStatus);
  //     const payload: IGetAllLandPayload = { query };
  //     if (page) payload.page = page;
  //     if (sort) payload.sort = sort;
  //     if (category) query.category = String(category);
  //     if (isSold) query.isSold = isSold;
  //     if (search) query.email = String(search);
  //     return await findAllListedLand(payload);
  //   } catch (error) {
  //     if (error instanceof Error) {
  //       throw error;
  //     } else {
  //       throw new Error('Unknown Error Occurred get all listed land service');
  //     }
  //   }
  // },
  processDeleteListedLandItem: async ({ landId }: ILandPayload) => {
    try {
      const { images } = (await deleteListedLandItem({ landId })) as ILand;
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
        throw new Error('Unknown Error Occurred In delete listed land item service');
      }
    }
  },
  processGetLandField: async ({ id, field }: { id: string; field: string }) => {
    try {
      const data = await findOneHostListedStepLandField({ id, field });
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Retrieve One Listed Land Service');
      }

    }

  },
    processSetLandSelected : async ({ id, selected }: { id: string, selected: boolean }) => {
    try {
      const data= await setLandSelected({ id, selected });
      return data;
    } catch (error) {
      if (error instanceof Error) {
          throw error;
        } else {
          throw new Error('Unknown Error Occurred In Retrieve One Listed Land Service');
        }
    }
  }
  
};

export default LandServices;
