import { join } from 'path';
import IRent, {
  ICreateRentPayload,
  IGetAllRentPayload,
  IGetAllRentQuery,
  IGetAllRentRequestedQuery,
  IRentPayload,
} from './rent.interfaces';
import RentRepositories from './rent.repositories';
import { promises as fs } from 'fs';
import SlugUtils from '../../utils/slug.utils';

const { generateSlug } = SlugUtils;

const {
  initializedRentListing,
  creatingRentListingById,
  processHostListedRentProperties,
  findAllListedRent,
  deleteListedRentItem,
  createNewRent,
  findOneListedRent,
  findOneListedRentById,
  findOneHostListedStepField,
  findAllSearchingRent,
  handleRentDateBlockList,
  handleGetRentDateBlockList,
  setRentSelected
} = RentRepositories;
const RentServices = {
  processInitializeRentListing: async ({ host, payload }: IRentPayload) => {
    try {
      const data = await initializedRentListing({ host, payload });
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In initialize rent listing service');
      }
    }
  },
  processProgressRentListing: async ({ rentId, payload }: IRentPayload) => {
    try {
      const { title } = payload as IRent;
      if (title) (payload as IRent).slug = generateSlug(title);
      const data = await creatingRentListingById({ payload, rentId });
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In initialize rent listing service');
      }
    }
  },
  processCreateRent: async ({ images, payload }: ICreateRentPayload) => {
    try {
      const {
        allowableThings,
        amenities,
        cancellationPolicy,
        category,
        floorPlan,
        description,
        host,
        houseRules,
        listingFor,
        price,
        location,
        title,
      } = payload as IRent;
      const uploadedImages = images?.map((item) => `/public/${item}`) as string[];
      const slug = generateSlug(title as string);
      const postPayload: IRent = {
        slug,
        images: uploadedImages,
        coverImage: uploadedImages[0],
        allowableThings,
        amenities,
        cancellationPolicy,
        category,
        floorPlan,
        description,
        host,
        houseRules,
        listingFor,
        price,
        location,
        title,
      };
      const data = await createNewRent(postPayload);
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
  processUploadImage: async ({ images, rentId }: IRentPayload) => {
    try {
      const uploadedImages = images?.map((item) => `/public/${item}`) as string[];
      const payload: IRent = {
        images: uploadedImages,
        coverImage: uploadedImages[0],
      };
      const data = await creatingRentListingById({ payload, rentId });
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
  processUnlinkImage: async ({ singleImage, images, rentId }: IRentPayload) => {
    const image = singleImage as String;
    const relativeImagePath = image.replace('/public/', '');
    const filePath = join(__dirname, '../../../public', relativeImagePath);
    try {
      const payload: IRent = {};
      if (images) {
        payload.coverImage = images[0];
        payload.images = images;
      }
      await Promise.all([fs.unlink(filePath), creatingRentListingById({ payload, rentId })]);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In unlink rent listing image service');
      }
    }
  },
  processHostListedRentProperties: async ({ host, page, limit }: IRentPayload) => {
    try {
      return await processHostListedRentProperties({ host, page, limit });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In unlink rent listing image service');
      }
    }
  },

    handleRentDateBlockList: async ({ host, payload }: { host: string, payload: any }) => {
    try {
      return await handleRentDateBlockList({ host, payload });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In unlink rent listing image service');
      }
    }
  },

  handleGetRentDateBlockList: async ({ payload }: {  payload: any }) => {
    try {
      return await handleGetRentDateBlockList({ payload });
    }
    catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In unlink rent listing image service');
      }
    }
  },
  processRetrieveOneListedRent: async ({ slug }: IRentPayload) => {
    try {
      return await findOneListedRent({ slug });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Retrieve One Listed Rent Service');
      }
    }
  },
  processRetrieveOneListedRentById: async ({ rentId }: IRentPayload) => {
    try {
      return await findOneListedRentById({ rentId });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Retrieve One Listed Rent Service');
      }
    }
  },
  processChangeStatus: async ({ rentId, payload }: IRentPayload) => {
    try {
      const data = await creatingRentListingById({ payload, rentId });
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In change status service');
      }
    }
  },
  processGetAllListedRent: async ({
    page,
    status,
    sort,
    search,
    category,
    userId,
    role,
  }: IGetAllRentRequestedQuery) => {
    try {
      const query: IGetAllRentQuery = {};
      if (status) query.status = String(status);
      if (search) query.email = String(search);
      if (category) query.category = String(category);
      const payload: IGetAllRentPayload = { query };
      if (page) payload.page = page;
      if (sort) payload.sort = sort;
      if (role === 'host') {
        if (userId) query.host = userId;
      }
      return await findAllListedRent(payload);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred get all listed rent service');
      }
    }
  },
  processDeleteListedRentItem: async ({ rentId }: IRentPayload) => {
    try {
      const { images } = (await deleteListedRentItem({ rentId })) as IRent;
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
        throw new Error('Unknown Error Occurred In delete listed rent item service');
      }
    }
  },
  processGetRentField: async ({ id, field }: { id: string; field: string }) => {
    try {
      const data = await findOneHostListedStepField({ id, field });
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Retrieve One Listed Rent Service');
      }

    }
    
  },
  searchRentListings: async ({
    payload,
    page,
    limit,
    sort,
  }: { payload: any; page?: number; sort?: string, limit?: number }) => {
    console.log('searchRentListings', payload, page, sort, limit);
    let parsedSort: 1 | -1 | undefined;
    if (sort === '1') parsedSort = 1;
    else if (sort === '-1') parsedSort = -1;
    else parsedSort = undefined;
    const result = await findAllSearchingRent({ query: payload, page, sort: parsedSort, limit});
    return result;
  },
   processSetRentSelected : async ({ id, selected }: { id: string, selected: boolean }) => {
  try {
    const data= await RentRepositories.setRentSelected({ id, selected });
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

export default RentServices;
