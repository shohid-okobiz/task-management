import { NextFunction, Request, Response } from 'express';
import logger from '../../configs/logger.configs';
import mongoose from 'mongoose';
import { documentPerPage } from '../../const';
import LandServices from './land.services';
import ILand, { IGetAllLandRequestedQuery, ILandImagesPath } from './land.interfaces';


const {
  processDeleteListedLandItem,
  processGetAllListedLand,
  processHostListedLandProperties,
  processInitializeLandListing,
  processUnlinkImage,
  processUpdateLandListing,
  processUploadImage,
  processCreateLand,
  processChangeStatus,
  processRetrieveOneListedLand,
  processRetrieveOneListedLandById,
  processGetLandField,
  processSetLandSelected
 
} = LandServices;

const LandControllers = {
  handleRetrieveOneListedLand: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { slug } = req.params;
      const data = await processRetrieveOneListedLand({ slug });
      res.status(201).json({
        status: 'success',
        message: 'Land Retrieve Successful',
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleRetrieveOneListedLandById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ status: 'error', message: 'Invalid team member ID' });
        return;
      }
      const landId = new mongoose.Types.ObjectId(id);
      const data = await processRetrieveOneListedLandById({ landId });
      res.status(201).json({
        status: 'success',
        message: 'Land Retrieve Successful',
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleInitializeLandListing: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.authenticateTokenDecoded;
      const data = await processInitializeLandListing({ userId });
      res.status(201).json({
        status: 'success',
        message: 'new land listing initialized',
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleCreateLand: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.authenticateTokenDecoded;
      const payload = req.body as ILand;
      payload.host = userId;
      const images = (req?.files as ILandImagesPath[])?.map((item) => item.filename);
      const data = await processCreateLand({ images, payload });
      res.status(200).json({
        status: 'success',
        message: 'New Land Created',
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleChangeStatus: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ status: 'error', message: 'Invalid Land ID' });
        return;
      }
      const landId = new mongoose.Types.ObjectId(id);
      const { status, isSold } = req.body;
      const reqBody: ILand = {};
      if (status) reqBody.publishStatus = status;
      if (isSold) reqBody.isSold = isSold;
      const data = await processChangeStatus({ landId, reqBody });
      res.status(200).json({
        status: 'success',
        message: `Listed item status Changed to ${status}`,
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleUpdateLandListingField: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ status: 'error', message: 'Invalid feature ID' });
        return;
      }
      const reqBody = req.body;
      const landId = new mongoose.Types.ObjectId(id);
      const data = await processUpdateLandListing({ landId, reqBody });
      res.status(200).json({
        status: 'success',
        message: 'new land listing initialized',
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleUploadImage: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ status: 'error', message: 'Invalid feature ID' });
        return;
      }
      const landId = new mongoose.Types.ObjectId(id);
      const images = (req?.files as ILandImagesPath[])?.map((item) => item.filename);
      const data = await processUploadImage({ landId, images });
      res.status(200).json({
        status: 'success',
        message: 'Image upload successful',
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleUnlinkImage: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ status: 'error', message: 'Invalid feature ID' });
        return;
      }
      const landId = new mongoose.Types.ObjectId(id);
      const { images, imageUrl } = req.body;
      await processUnlinkImage({
        landId,
        images,
        singleImage: imageUrl as string,
      });
      res.status(200).json({
        status: 'success',
        message: 'Image delete successful',
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleGetAllHostListedLand: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.authenticateTokenDecoded;
      const host = userId;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || documentPerPage;
      console.log(`Host: ${host}, Page: ${page}, Limit: ${limit}`);
      const {data, total} = await processHostListedLandProperties({ userId: host, page, limit });
      res.status(200).json({
        status: 'success',
        message: 'Listed Properties For Land Retrieve successful',
        totalContacts: total,
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleGetAllLand: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const {
        publishStatus,
        page,
        sort,
        search,
        isSold,
        category,
        location,
        minPrice,
        maxPrice,
        limit,
      } = req.query as unknown as IGetAllLandRequestedQuery;
      const perPage = limit ? Number(limit) : documentPerPage;

      const { data, total } = await processGetAllListedLand({
        publishStatus,
        page,
        sort,
        search,
        isSold,
        category,
        location,
        minPrice,
        maxPrice,
         limit: perPage,
      });

      const totalPages = Math.ceil(total / documentPerPage);
      const currentPage = Number(page) || 1;

      const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}${req.path}`;
      const buildQuery = (pageNumber: number) => {
        const query = new URLSearchParams();
        if (isSold !== undefined) query.set('isSold', String(isSold));
        if (search) query.set('search', search);
        if (publishStatus) query.set('publishStatus', publishStatus);
        if (category) query.set('category', String(category));
        if (sort) query.set('sort', String(sort));
        if (limit !== undefined) query.set("limit", String(limit));
        if (location) query.set('location', location);
        if (minPrice !== undefined) query.set('minPrice', String(minPrice));
        if (maxPrice !== undefined) query.set('maxPrice', String(maxPrice));
        if (pageNumber !== 1) query.set('page', String(pageNumber));

        const queryString = query.toString();
        return queryString ? `${baseUrl}?${queryString}` : baseUrl;
      };

      const currentPageUrl = buildQuery(currentPage);
      const nextPageUrl = currentPage < totalPages ? buildQuery(currentPage + 1) : null;
      const previousPageUrl = currentPage > 1 ? buildQuery(currentPage - 1) : null;

      res.status(200).json({
        status: 'success',
        message: 'All Listed Land Item Retrieve successful',
        totalLand: total,
        totalPages,
        currentPageUrl,
        nextPageUrl,
        previousPageUrl,
        data,
      });
    } catch (error) {
      logger.error((error as Error).message);
      next(error);
    }
  },
  // handleGetAllLand: async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     const { publishStatus, page, sort, search, isSold, category } =
  //       req.query as IGetAllLandRequestedQuery;
  //     const { data, total } = await processGetAllListedLand({
  //       publishStatus,
  //       page,
  //       sort,
  //       search,
  //       isSold,
  //       category,
  //     });
  //     const totalPages = Math.ceil(total / documentPerPage);
  //     const totalLand = total;
  //     // const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}${
  //     //   req.path
  //     // }`;
  //     // const buildQuery = (pageNumber: number) => {
  //     //   const query = new URLSearchParams();
  //     //   if (isSold) query.set("search", String(isSold));
  //     //   if (search) query.set("search", search);
  //     //   if (publishStatus) query.set("publishStatus", publishStatus);
  //     //   if (sort) query.set("sort", String(sort));
  //     //   query.set("page", String(pageNumber));
  //     //   return `${baseUrl}?${query.toString()}`;
  //     // };
  //     const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}${req.path}`;

  //     const buildQuery = (pageNumber: number) => {
  //       const query = new URLSearchParams();
  //       if (isSold !== undefined) query.set('isSold', String(isSold));
  //       if (search) query.set('search', search);
  //       if (publishStatus) query.set('publishStatus', publishStatus);
  //       if (category) query.set('category', String(category));
  //       if (sort) query.set('sort', String(sort));
  //       if (pageNumber !== 1) query.set('page', String(pageNumber));

  //       const queryString = query.toString();
  //       return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  //     };

  //     const currentPage = Number(page) || 1;
  //     const currentPageUrl = buildQuery(currentPage);
  //     const nextPageUrl = currentPage < totalPages ? buildQuery(currentPage + 1) : null;
  //     const previousPageUrl = currentPage > 1 ? buildQuery(currentPage - 1) : null;
  //     res.status(200).json({
  //       status: 'success',
  //       message: `All Listed Land Item Retrieve successful`,
  //       totalLand,
  //       totalPages,
  //       currentPageUrl,
  //       nextPageUrl,
  //       previousPageUrl,
  //       data,
  //     });
  //   } catch (error) {
  //     const err = error as Error;
  //     logger.error(err.message);
  //     next();
  //   }
  // },
  handleDeleteListedLandItem: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ status: 'error', message: 'Invalid feature ID' });
        return;
      }
      const landId = new mongoose.Types.ObjectId(id);
      await processDeleteListedLandItem({ landId });
      res.status(200).json({
        status: 'success',
        message: `Item delete successful`,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleGetLandField: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, field } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ status: 'error', message: 'invalid listing id' });
        return;
      }
      const data = await processGetLandField({ id, field });
      res.status(200).json({
        status: 'success',
        message: `Land field data get successfully`,
        data: data

      })

    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();

    }
  },
  // HandleLandSearchProcess: async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     const { location, minPrice, maxPrice, category } = req.query;
  //     const query = buildLandQuery({
  //       location: location as string,
  //       minPrice: minPrice ? Number(minPrice) : undefined,
  //       maxPrice: maxPrice ? Number(maxPrice) : undefined,
  //       category: category as string,
  //     });
  //     const result = await searchLandListingHandleMethod({
  //       query
  //     })
  //     res.status(200).json({ success: true, data: result });

  //   } catch (error) {
  //     next(error);
  //   }
  // }
  handleSetLandSelected: async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { selected } = req.body;

    const updated = await processSetLandSelected({ id, selected });

    res.status(200).json({
      status: 'success',
      message: 'Rent selection updated',
      data: updated,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('maximum of 9')) {
       res.status(400).json({
        status: 'error',
        message: error.message,
      });
    }
    next(error);
  }
},
};

export default LandControllers;
