import { NextFunction, Request, Response } from 'express';
import logger from '../../configs/logger.configs';
import RentServices from './rent.services';
import mongoose from 'mongoose';
import IRent, { IGetAllRentRequestedQuery, IRentImagesPath } from './rent.interfaces';
import { documentPerPage } from '../../const';

const {
  processInitializeRentListing,
  processProgressRentListing,
  processUploadImage,
  processUnlinkImage,
  processHostListedRentProperties,
  processChangeStatus,
  processGetAllListedRent,
  processDeleteListedRentItem,
  processCreateRent,
  processRetrieveOneListedRent,
  processRetrieveOneListedRentById,
  processGetRentField,
  searchRentListings,
  handleRentDateBlockList,
  handleGetRentDateBlockList,
  processSetRentSelected
} = RentServices;
const RentControllers = {
  handleRetrieveOneListedRent: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { slug } = req.params;
      const data = await processRetrieveOneListedRent({ slug });
      res.status(201).json({
        status: 'success',
        message: 'Rent Retrieve Successful',
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleRetrieveOneListedRentById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ status: 'error', message: 'Invalid feature ID' });
        return;
      }
      const rentId = new mongoose.Types.ObjectId(id);
      const data = await processRetrieveOneListedRent({ rentId });
      res.status(201).json({
        status: 'success',
        message: 'Rent Retrieve Successful',
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleInitializeRentListing: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.authenticateTokenDecoded;
      const { listingFor } = req.body;
      const payload = { listingFor } as IRent;
      const data = await processInitializeRentListing({
        payload,
        host: userId,
      });
      res.status(201).json({
        status: 'success',
        message: 'new rent listing initialized',
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleProgressCreatingRentListing: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status } = req.body;
      if (status) {
        res.status(403).json({
          status: 'error',
          message: 'You are not allowed to modify the status field.',
        });
      }
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ status: 'error', message: 'Invalid feature ID' });
        return;
      }
      const rentId = new mongoose.Types.ObjectId(id);
      const payload = req.body;
      const data = await processProgressRentListing({
        rentId,
        payload,
      });
      res.status(200).json({
        status: 'success',
        message: 'New Field Data Added',
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleCreateRent: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.authenticateTokenDecoded;
      const payload = req.body as IRent;
      payload.host = userId;
      const images = (req?.files as IRentImagesPath[])?.map((item) => item.filename);
      const data = await processCreateRent({ images, payload });
      res.status(200).json({
        status: 'success',
        message: 'New Rent Created',
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
      console.log('id ------', id);
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ status: 'error', message: 'Invalid feature ID' });
        return;
      }
      const rentId = new mongoose.Types.ObjectId(id);
      const images = (req?.files as IRentImagesPath[])?.map((item) => item.filename);
      if (images === undefined || images.length === 0) {
        res.status(400).json({ status: 'error', message: 'No images uploaded' });
        return;
      }
      const data = await processUploadImage({ images, rentId });
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
      const rentId = new mongoose.Types.ObjectId(id);
      const { images, imageUrl } = req.body;
      await processUnlinkImage({
        rentId,
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
  handleGetAllHostListedPropertiesForRent: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { userId } = req.authenticateTokenDecoded;
      const host = userId;
      const { page, limit, } = req.query as IGetAllRentRequestedQuery;
      const {data, total} = await processHostListedRentProperties({ host, page, limit });
      res.status(200).json({
        status: 'success',
        message: 'Listed Properties For Rent Retrieve successful',
        totalContacts: total,
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },

    handleRentDateBlockList: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { userId } = req.authenticateTokenDecoded;
      const payload = req.body;
      const host = userId.toString();
      const data = await handleRentDateBlockList({ host, payload });
      res.status(200).json({
        status: 'success',
        message: 'Listed Properties For Rent Retrieve successful',
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(error);
    }
  },

  handleGetRentDateBlockList: async (
    req: Request, res: Response, next: NextFunction
  ) => { 
    try {
       const payload = req.query as { rentId?: string };
      const data = await handleGetRentDateBlockList({  payload  });
      res.status(200).json({
        status: 'success',
        message: 'Listed Properties For Rent Retrieve successful',
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(error);
    }
  },
  handleChangeStatus: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ status: 'error', message: 'Invalid feature ID' });
        return;
      }
      const rentId = new mongoose.Types.ObjectId(id);
      const { status } = req.body;
      const payload: IRent = {
        status,
      };
      const data = await processChangeStatus({ rentId, payload });
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
  handleGetAllRent: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status, page, sort, search, category } = req.query as IGetAllRentRequestedQuery;
      const { data, total } = await processGetAllListedRent({
        search,
        status,
        page,
        sort,
        category,
      });
      const totalPages = Math.ceil(total / documentPerPage);
      const totalRents = total;
      const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}${req.path}`;

      const buildQuery = (pageNumber: number) => {
        const query = new URLSearchParams();
        if (search) query.set('search', search);
        if (status) query.set('status', status);
        if (sort) query.set('sort', String(sort));
        if (category) query.set('category', String(category));
        if (pageNumber !== 1) query.set('page', String(pageNumber));

        const queryString = query.toString();
        return queryString ? `${baseUrl}?${queryString}` : baseUrl;
      };
      const currentPage = Number(page) || 1;
      const currentPageUrl = buildQuery(currentPage);
      const nextPageUrl = currentPage < totalPages ? buildQuery(currentPage + 1) : null;
      const previousPageUrl = currentPage > 1 ? buildQuery(currentPage - 1) : null;
      res.status(200).json({
        status: 'success',
        message: `All Listed Rent Item Retrieve successful`,
        totalRents,
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

  handleDeleteListedRentItem: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ status: 'error', message: 'Invalid feature ID' });
        return;
      }
      const rentId = new mongoose.Types.ObjectId(id);
      await processDeleteListedRentItem({ rentId });
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
  handleGetRentField: async (req: Request, res: Response, next: NextFunction) => {

    try {
      const { id, field } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ status: 'error', message: 'invalid listing id' });
        return;
      }
      const data = await processGetRentField({ id, field });
      res.status(200).json({
        status: 'success',
        message: `Rent field data get successfully`,
        data: data

      })

    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();

    }
  },
  HandleSearchRentListings: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        location,
        checkinDate,
        checkoutDate,
        page,
        limit,
        sort,
        bedroomCount,
        bathCount,
        bedCount,
        guestCount,
        status,
        category,
      } = req.query;

      const payload = {
        location,
        checkinDate,
        checkoutDate,
        bedroomCount,
        bathCount,
        bedCount,
        guestCount,
        status,
        category,
      };

      const result = await searchRentListings({
        payload,
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : documentPerPage,
        sort: sort === "1" ? "1" : "-1",
      });

      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  },
handleSetRentSelected: async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { selected } = req.body;

    const updated = await processSetRentSelected({ id, selected });

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

export default RentControllers;
