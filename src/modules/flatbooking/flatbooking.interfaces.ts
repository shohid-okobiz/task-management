import { Types } from 'mongoose';

export enum FlatBookingStatus {
  AVAILABLE = 'available',
  SOLD_OUT = 'sold_out',
}

export interface IFlatBooking {
  flat: Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  message?: string;
  user?: Types.ObjectId;
  status?: FlatBookingStatus;
}
