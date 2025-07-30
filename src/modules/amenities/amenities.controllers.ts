import { NextFunction, Request, Response } from "express";
import logger from "../../configs/logger.configs";
import mongoose from "mongoose";
import AmenitiesServices from "./amenities.services";
import IAmenities, { IAmenitiesPayload } from "./amenities.interfaces";
const {
  processCreateAmenities,
  processDeleteAmenities,
  processRetrieveAllAmenities,
  processUpdateAmenities,
  processUpdateAmenitiesField,
} = AmenitiesServices;
const AmenitiesControllers = {
  handleCreateAmenities: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const amenitiesImage = req?.file?.filename;
      const { amenitiesLabel } = req.body;
      const data = await processCreateAmenities({
        amenitiesImage,
        amenitiesLabel,
      } as IAmenitiesPayload);
      res.status(201).json({
        status: "success",
        message: "Amenities created successfully",
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleUpdateAmenitiesField: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { id } = req.params;
    const { amenitiesLabel } = req.body as IAmenities;
    console.log(amenitiesLabel);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res
        .status(400)
        .json({ status: "error", message: "Invalid amenities ID" });
      return;
    }
    const amenitiesId = new mongoose.Types.ObjectId(id);

    try {
      const data = await processUpdateAmenitiesField({
        amenitiesId,
        amenitiesLabel,
      });
      res.status(200).json({
        status: "success",
        message: "Amenities field successful",
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleUpdateAmenities: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { id } = req.params;
    const { amenitiesImage } = req.amenities as IAmenitiesPayload;
    const amenitiesOldImage = amenitiesImage;
    const { amenitiesLabel } = req.body as IAmenitiesPayload;

    const newImage = req?.file?.filename;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res
        .status(400)
        .json({ status: "error", message: "Invalid amenities ID" });
      return;
    }
    const amenitiesId = new mongoose.Types.ObjectId(id);
    try {
      const data = await processUpdateAmenities({
        amenitiesId,
        amenitiesImage: newImage,
        amenitiesLabel,
        amenitiesOldImage,
      });
      res.status(200).json({
        status: "success",
        message: "Amenities update successful",
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleRetrieveAllAmenities: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const data = await processRetrieveAllAmenities();
      res.status(200).json({
        status: "success",
        message: "Amenities retrieve successful",
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },

  handleDeleteAmenities: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const { amenitiesImage } = req.amenities as IAmenitiesPayload;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ status: "error", message: "Invalid banner ID" });
        return;
      }

      const amenitiesId = new mongoose.Types.ObjectId(id);
      await processDeleteAmenities({ amenitiesId, amenitiesImage });

      res.status(200).json({
        status: "success",
        message: "Amenities deleted successfully",
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
};

export default AmenitiesControllers;
