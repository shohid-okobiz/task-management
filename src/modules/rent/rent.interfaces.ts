import { Types } from "mongoose";

export enum RentListingStatus {
  IN_PROGRESS = "in_progress",
  PENDING = "pending",
  PUBLISHED = "published",
  UNPUBLISHED = "unpublished",
}

export interface IBlockdate {
  rent?: Types.ObjectId;
  blockDate: Date;
}

export interface IFloorPlan {
  guestCount: number;
  bathCount: number;
  bedCount: number;
  bedroomCount: number;
}

interface IRent {
  latitude?: number;
  longitude?: number;
  selected?: boolean;
  title?: string;
  images?: string[];
  coverImage?: string;
  description?: string;
  floorPlan?: IFloorPlan;
  location?: string;
  price?: number;
  category?: Types.ObjectId;
  listingFor?: Types.ObjectId;
  cancellationPolicy?: string[];
  houseRules?: string[];
  allowableThings?: string[];
  amenities?: Types.ObjectId[];
  status?: RentListingStatus;
  host?: Types.ObjectId;
  slug?: string;
  checkinDate?: Date | null;
  checkoutDate?: Date | null;
  adultCount?: number;
  childrenCount?: number;
}
export interface ICreateRentPayload {
  images?: string[];
  payload?: IRent;
}
export interface IRentPayload {
  slug?: string;
  payload?: IRent;
  rentId?: Types.ObjectId;
  listingStatus?: RentListingStatus;
  host?: Types.ObjectId;
  images?: string[];
  singleImage?: string;
  coverImageIndex?: number;
  page?: number;
  limit?: number;
}
export interface IRentImagesPath {
  filename: string;
}

export interface IGetAllRentRequestedQuery {
  category?: string;
  search?: string;
  status?: string;
  page?: number;
  sort?: 1 | -1;
  userId?: Types.ObjectId;
  role?: string;
  limit?: number;
}

export interface IGetAllRentQuery {
  category?: string;
  host?: Types.ObjectId;
  status?: string;
  location?: string;
  checkinDate?: string;
  checkoutDate?: string;
  bedroomCount?: number;
  bathCount?: number;
  bedCount?: number;
  guestCount?: number;
  email?: string;
  [key: string]: any;
}

// export interface IGetAllRentQuery {
//   location?: string;
//   checkinDate?: string;
//   checkoutDate?: string;
//   bedroomCount?: number;
//   bathCount?: number;
//   bedCount?: number;
//   guestCount?: number;
//   email?: string;
//   [key: string]: any;
// }

export interface ICalendar {
  rentId: Types.ObjectId;

}

export interface IGetAllRentPayload {
  query: IGetAllRentQuery;
  page?: number;
  sort?: 1 | -1;
  limit?: number;
  
}


export default IRent;
