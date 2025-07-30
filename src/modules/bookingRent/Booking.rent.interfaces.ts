import { Types } from "mongoose";

export enum RentListingStatus {
  IN_PROGRESS = "in_progress",
  PENDING = "pending",
  PUBLISHED = "published",
  UNPUBLISHED = "unpublished",
}

export interface IFloorPlan {
  guestCount: number;
  bathCount: number;
  bedCount: number;
  bedroomCount: number;
}

export interface IBookingRentPayload extends Document {
  user_id?: Types.ObjectId;
  rent_id?: Types.ObjectId;
  checkIn?: Date;
  checkout?: string[];
  paymentId?: Types.ObjectId;
}

