import { NextFunction, Request, Response } from "express";
import logger from "../../configs/logger.configs";
import FaqServices from "./faq.services";
import mongoose from "mongoose";
const {
  processCreateFaq,
  processDeleteFaq,
  processRetrieveAllFaqs,
  processUpdateFaq,
} = FaqServices;
const FaqControllers = {
  handleCreateFaq: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await processCreateFaq(req.body);
      res.status(201).json({
        status: "success",
        message: "Faq create successful",
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleRetrieveAllFaq: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const data = await processRetrieveAllFaqs();
      res.status(200).json({
        status: "success",
        message: "Faq retrieve successful",
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleUpdateFaq: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { faqQuestion, faqAnswer } = req.body;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ status: "error", message: "Invalid faq ID" });
        return;
      }
      const faqId = new mongoose.Types.ObjectId(id);
      const data = await processUpdateFaq({ faqId, faqQuestion, faqAnswer });
      res.status(200).json({
        status: "success",
        message: "Faq update successful",
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleDeleteFaq: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ status: "error", message: "Invalid faq ID" });
        return;
      }
      const faqId = new mongoose.Types.ObjectId(id);
      const data = await processDeleteFaq({ faqId });
      res.status(200).json({
        status: "success",
        message: "Faq delete successful",
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
};

export default FaqControllers;
