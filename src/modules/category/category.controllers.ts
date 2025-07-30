import { NextFunction, Request, Response } from "express";
import logger from "../../configs/logger.configs";
import CategoryServices from "./category.services";
 
const {
  processCreateCategory,
  processRetrieveCategory,

} = CategoryServices;
const CategoryControllers = {
  handleCreateCategory: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const data = await processCreateCategory(req.body);
      res.status(201).json({
        status: "success",
        message: "Category create successful",
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },

  handleRetrieveCategories: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const data = await processRetrieveCategory();
      res.status(200).json({
        status: "success",
        message: "Category retrieved successful",
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },

};

export default CategoryControllers;
