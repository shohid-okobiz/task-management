import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import AmenitiesRepositories from "./amenities.repositories";
const { findOneAmenities } = AmenitiesRepositories;
const AmenitiesMiddlewares = {
  isAmenitiesExist: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res
        .status(400)
        .json({ status: "error", message: "Invalid amenities ID" });
      return;
    }
    const amenitiesId = new mongoose.Types.ObjectId(id);
    const isFound = await findOneAmenities({ amenitiesId });
    if (!isFound) {
      res.status(404).json({ status: "error", message: "Amenities not found" });
      return;
    }
    req.amenities = isFound;
    next();
  },
};

export default AmenitiesMiddlewares;
