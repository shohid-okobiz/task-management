import { NextFunction, Request, Response } from "express";
import logger from "../../configs/logger.configs";
import FeatureServices from "./feature.services";
import mongoose, { ObjectId } from "mongoose";
const {
  processCreateFeature,
  processRetrieveAllFeatures,
  processUpdateFeature,
  processDeleteFeature,
} = FeatureServices;

const FeatureControllers = {
  handleCreateFeature: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const data = await processCreateFeature(req.body);
      res.status(201).json({
        status: "success",
        message: "Feature create successful",
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleRetrieveAllFeature: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const data = await processRetrieveAllFeatures();
      res.status(200).json({
        status: "success",
        message: "Feature retrieve successful",
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleUpdateFeature: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const { featureName } = req.body;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res
          .status(400)
          .json({ status: "error", message: "Invalid feature ID" });
        return;
      }
      const featureId = new mongoose.Types.ObjectId(id);
      const data = await processUpdateFeature({ featureId, featureName });
      res.status(200).json({
        status: "success",
        message: "Feature update successful",
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleDeleteFeature: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res
          .status(400)
          .json({ status: "error", message: "Invalid feature ID" });
        return;
      }
      const featureId = new mongoose.Types.ObjectId(id);
      const data = await processDeleteFeature({ featureId });
      res.status(200).json({
        status: "success",
        message: "Feature delete successful",
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
};
export default FeatureControllers;
