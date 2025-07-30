import { NextFunction, Request, Response } from "express";
import logger from "../../configs/logger.configs";
import { Types } from "mongoose";
import SubCategoryServices from "./subCategory.services";
import { ISubCategoryPayload } from "./subCategory.interfaces";

const {
  processCreateSubCategory,
  processDeleteSubCategory,
  processRetrieveSubCategory,
  processUpdateSubCategory,
} = SubCategoryServices;

const SubCategoryControllers = {
  handleCreateSubCategory: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const data = await processCreateSubCategory(req.body);
      res.status(201).json({
        status: "success",
        message: "Sub Category create successful",
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleUpdateSubCategory: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const { subCategoryName, category } = req.body;
      if (!Types.ObjectId.isValid(id)) {
        res
          .status(400)
          .json({ status: "error", message: "Invalid sub category ID" });
        return;
      }
      const subCategoryId = new Types.ObjectId(id);
      const data = await processUpdateSubCategory({
        subCategoryId,
        category,
        subCategoryName,
      });
      res.status(200).json({
        status: "success",
        message: "Sub category update successful",
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleRetrieveSubCategories: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { category_id } = req.query;
      const id = new Types.ObjectId(category_id as string);
      let payload: ISubCategoryPayload = {};
      if (!Types.ObjectId.isValid(id)) {
        res
          .status(400)
          .json({ status: "error", message: "Invalid category ID" });
        return;
      }
      if (category_id) {
        payload = { category: id };
      }
      const data = await processRetrieveSubCategory(payload);
      res.status(200).json({
        status: "success",
        message: "Sub category retrieved successful",
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleDeleteSubCategory: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      if (!Types?.ObjectId.isValid(id)) {
        res
          .status(400)
          .json({ status: "error", message: "Invalid sub category ID" });
        return;
      }
      const subCategoryId = new Types.ObjectId(id);
      const data = await processDeleteSubCategory({ subCategoryId });
      res.status(200).json({
        status: "success",
        message: "Sub category delete successful",
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
};

export default SubCategoryControllers;
