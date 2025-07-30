
import { FilterQuery } from 'mongoose';
import ILand from '../modules/land/land.interfaces';


interface LandQueryParams {
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  category?: string; 
}

export const buildLandQuery = (params: LandQueryParams): FilterQuery<ILand> => {
  const query: FilterQuery<ILand> = {};

  if (params.location) {
    query.location = { $regex: params.location, $options: 'i' }; 
  }

  if (params.minPrice !== undefined || params.maxPrice !== undefined) {
    query.price = {};
    if (params.minPrice !== undefined) query.price.$gte = params.minPrice;
    if (params.maxPrice !== undefined) query.price.$lte = params.maxPrice;
  }

  if (params.category) {
    query.category = params.category;
  }

  return query;
};
