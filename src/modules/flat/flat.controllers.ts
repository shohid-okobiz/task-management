import { NextFunction, Request, Response } from 'express';
import logger from '../../configs/logger.configs';
import mongoose from 'mongoose';
import { documentPerPage } from '../../const';
import FlatServices from './flat.services';
import IFlat, { IFlatImagesPath, IGetAllFlatRequestedQuery } from './flat.interfaces';

const {
  processInitializeFlatListing,
  processUpdateFlatListing,
  processUploadImage,
  processUnlinkImage,
  handleGetAllHostListedPropertiesForFlat,
  processGetAllListedFlat,
  processDeleteListedFlatItem,
  processCreateFlat,
  processChangeStatus,
  processRetrieveOneListedFlat,
  processRetrieveOneListedFlatById,
  processGetFlatField,
  processSetFlattSelected
} = FlatServices;

const FlatControllers = {
  handleRetrieveOneListedFlat: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { slug } = req.params;
      const data = await processRetrieveOneListedFlat({ slug });
      res.status(201).json({
        status: 'success',
        message: 'Flat Retrieve Successful',
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleRetrieveOneListedFlatById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ status: 'error', message: 'Invalid feature ID' });
        return;
      }
      const flatId = new mongoose.Types.ObjectId(id);
      const data = await processRetrieveOneListedFlatById({ flatId });
      res.status(201).json({
        status: 'success',
        message: 'Flat Retrieve Successful',
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleInitializeFlatListing: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.authenticateTokenDecoded;
      const data = await processInitializeFlatListing({ userId });
      res.status(201).json({
        status: 'success',
        message: 'new flat listing initialized',
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleUpdateFlatListingField: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ status: 'error', message: 'Invalid feature ID' });
        return;
      }
      const reqBody = req.body;
      const flatId = new mongoose.Types.ObjectId(id);
      const data = await processUpdateFlatListing({ flatId, reqBody });
      res.status(200).json({
        status: 'success',
        message: 'new flat listing initialized',
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleCreateFlat: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.authenticateTokenDecoded;
      const payload = req.body as IFlat;
      payload.host = userId;
      const images = (req?.files as IFlatImagesPath[])?.map((item) => item.filename);
      const data = await processCreateFlat({ images, payload });
      res.status(200).json({
        status: 'success',
        message: 'New Flat Created',
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
      const flatId = new mongoose.Types.ObjectId(id);
      const images = (req?.files as IFlatImagesPath[])?.map((item) => item.filename);
      const data = await processUploadImage({ flatId, images });
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
      const flatId = new mongoose.Types.ObjectId(id);
      const { images, imageUrl } = req.body;
      await processUnlinkImage({
        flatId,
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
  handleGetAllHostListedPropertiesForFlat: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { userId } = req.authenticateTokenDecoded;
      const host = userId;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || documentPerPage;
      const {data, total} = await handleGetAllHostListedPropertiesForFlat({ userId: host, page, limit });
      res.status(200).json({
        status: 'success',
        message: 'Listed Properties For Flat Retrieve successful',
        totalContacts: total,
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleGetAllFlat: async (req: Request, res: Response, next: NextFunction) => {
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
      } = req.query as IGetAllFlatRequestedQuery;
      const perPage = limit ? Number(limit) : documentPerPage;

      const { data, total } = await processGetAllListedFlat({
        publishStatus,
        page,
        sort,
        isSold,
        search,
        category,
        location,
        minPrice,
        maxPrice,
        limit: perPage,
      });

      const totalPages = Math.ceil(total / documentPerPage);
      const totalContacts = total;
      const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}${req.path}`;

      const buildQuery = (pageNumber: number) => {
        const query = new URLSearchParams();
        if (isSold !== undefined) query.set("isSold", String(isSold));
        if (category) query.set("category", String(category));
        if (search) query.set("search", search);
        if (publishStatus) query.set("publishStatus", publishStatus);
        if (sort !== undefined) query.set("sort", String(sort));
        if (limit !== undefined) query.set("limit", String(limit));
        if (location) query.set("location", location);
        if (minPrice !== undefined) query.set("minPrice", String(minPrice));
        if (maxPrice !== undefined) query.set("maxPrice", String(maxPrice));
        if (pageNumber !== 1) query.set("page", String(pageNumber));
        return query.toString() ? `${baseUrl}?${query.toString()}` : baseUrl;
      };

      const currentPage = Number(page) || 1;
      const currentPageUrl = buildQuery(currentPage);
      const nextPageUrl = currentPage < totalPages ? buildQuery(currentPage + 1) : null;
      const previousPageUrl = currentPage > 1 ? buildQuery(currentPage - 1) : null;

      res.status(200).json({
        status: "success",
        message: "All Listed Flat Item Retrieve successful",
        totalContacts,
        totalPages,
        currentPageUrl,
        nextPageUrl,
        previousPageUrl,
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },

  // handleGetAllFlat: async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     const { publishStatus, page, sort, search, isSold, category } =
  //       req.query as IGetAllFlatRequestedQuery;
  //     const { data, total } = await processGetAllListedFlat({
  //       publishStatus,
  //       page, 
  //       sort,
  //       isSold,
  //       search,
  //       category,
  //     });
  //     const totalPages = Math.ceil(total / documentPerPage);
  //     const totalContacts = total;
  //     const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}${req.path}`;

  //     const buildQuery = (pageNumber: number) => {
  //       const query = new URLSearchParams();
  //       if (isSold !== undefined) query.set('isSold', String(isSold));
  //       if (category) query.set('category', String(category));
  //       if (search) query.set('search', search);
  //       if (publishStatus) query.set('publishStatus', publishStatus);
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
  //       message: `All Listed Flat Item Retrieve successful`,
  //       totalContacts,
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
  handleChangeStatus: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ status: 'error', message: 'Invalid Land ID' });
        return;
      }
      const flatId = new mongoose.Types.ObjectId(id);
      const { status, isSold } = req.body;
      const reqBody: IFlat = {};
      if (status) reqBody.publishStatus = status;
      if (isSold) reqBody.isSold = isSold;
      const data = await processChangeStatus({ flatId, reqBody });
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
  handleDeleteListedFlatItem: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ status: 'error', message: 'Invalid feature ID' });
        return;
      }
      const flatId = new mongoose.Types.ObjectId(id);
      await processDeleteListedFlatItem({ flatId });
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
  handleGetFlatField: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, field } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ status: 'error', message: 'invalid listing id' });
        return;
      }
      const data = await processGetFlatField({ id, field });
      res.status(200).json({
        status: 'success',
        message: `Flat field data get successfully`,
        data: data

      })

    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();

    }
  },
  handleSetFlattSelected: async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { selected } = req.body;

    const updated = await processSetFlattSelected({ id, selected });

    res.status(200).json({
      status: 'success',
      message: 'Flat selection updated',
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

export default FlatControllers;
