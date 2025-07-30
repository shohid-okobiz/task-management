import { Types } from "mongoose";

export interface IFlatFloorPlan {
  unitCount?: number;
  drawing?: boolean;
  dinning?: boolean;
  balconyCount?: number;
  bedroomCount?: number;
  bathroomCount?: number;
}

export enum ListingPublishStatus {
  IN_PROGRESS = "in_progress",
  PENDING = "pending",
  PUBLISHED = "published",
  UNPUBLISHED = "unpublished",
}

export interface ICreateFlatPayload {
  images?: string[];
  payload?: IFlat;
}

interface IFlat {
  latitude?: number;
  longitude?: number;
  selected?: boolean;
  title?: string;
  description?: string;
  location?: string;
  images?: string[];
  video?: string;
  price?: number;
  coverImage?: string;
  category?: Types.ObjectId;
  listingFor?: Types.ObjectId;
  buildingYear?: string;
  floorPlan?: IFlatFloorPlan;
  amenities?: string[];
  host?: Types.ObjectId;
  publishStatus?: ListingPublishStatus;
  isSold?: boolean;
  slug?: string;
}

export interface IFlatPayload {
  userId?: Types.ObjectId;
  reqBody?: IFlat;
  flatId?: Types.ObjectId;
  images?: string[];
  singleImage?: string;
  isSold?: boolean;
  publishStatus?: string;
  slug?: string;
  page?: number;
  limit?: number;
}

export interface IFlatImagesPath {
  filename: string;
}

// export interface IGetAllFlatRequestedQuery {
//   category?: string;
//   isSold?: boolean;
//   search?: string;
//   publishStatus?: string;
//   page?: number;
//   sort?: 1 | -1;
// }

// export interface IGetAllFlatQuery {
//   category?: string;
//   isSold?: boolean;
//   host?: Types.ObjectId;
//   email?: string;
//   publishStatus?: string;
// }

// export interface IGetAllFlatPayload {
//   query: IGetAllFlatQuery;
//   page?: number;
//   sort?: 1 | -1;
// }

export interface IGetAllFlatRequestedQuery {
  category?: string;
  isSold?: boolean;
  search?: string;
  publishStatus?: string;
  page?: number;
  sort?: 1 | -1;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
   limit?: number;
}

export interface IGetAllFlatQuery {
  category?: string;
  isSold?: boolean;
  host?: Types.ObjectId;
  publishStatus?: string;
  email?: string;
  location?: { $regex: string; $options: string };
  price?: { $gte?: number; $lte?: number };
}

export interface IGetAllFlatPayload {
  query: IGetAllFlatQuery;
  page?: number;
  sort?: 1 | -1;
   limit?: number;
}


export default IFlat;
