import AboutUsServices from "./aboutUs.services";
import { NextFunction, Request, Response } from "express";
import logger from "../../configs/logger.configs";
import { Types } from "mongoose";
import { IAboutUsPayload } from "./aboutUs.interfaces";
const {
  processCreateAboutUs,
  processDeleteAboutUs,
  processRetriveAboutUs,
  processUpdateAboutUs,
} = AboutUsServices;

const AboutUsControllers = {
  handleCreateAboutUs: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const data = await processCreateAboutUs(req?.body);
      res.status(201).json({
        status: "success",
        message: "About Us create successful",
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleUpdateAboutUs: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const { description, videoUrl } = req.body as IAboutUsPayload;
      if (!Types.ObjectId.isValid(id)) {
        res
          .status(400)
          .json({ status: "error", message: "Invalid AboutUs ID" });
        return;
      }
      const AboutUsId = new Types.ObjectId(id);
      const data = await processUpdateAboutUs({
        id: AboutUsId,
        description,
        videoUrl,
      });
      res.status(200).json({
        status: "success",
        message: "AboutUs update successful",
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleRetriveAboutUs: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const data = await processRetriveAboutUs();
      res.status(200).json({
        status: "success",
        message: "AboutUs Retrieve successful",
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleDeleteAboutUs: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      if (!Types?.ObjectId.isValid(id)) {
        res
          .status(400)
          .json({ status: "error", message: "Invalid AboutUs ID" });
        return;
      }
      const AboutUsId = new Types.ObjectId(id);
      const data = await processDeleteAboutUs({ id: AboutUsId });
      res.status(200).json({
        status: "success",
        message: "AboutUs delete successful",
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
};

export default AboutUsControllers;
