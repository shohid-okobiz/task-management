import { Types } from 'mongoose';

export enum LandBookingStatus {
  AVAILABLE = 'available',
  SOLD_OUT = 'sold_out',
}

export interface ILandBooking {
  _id?: Types.ObjectId;
  land: Types.ObjectId;
  name?: string;
  email?: string;
  phone: string;
  message?: string | null;
  user?: Types.ObjectId | null;
  status?: LandBookingStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
