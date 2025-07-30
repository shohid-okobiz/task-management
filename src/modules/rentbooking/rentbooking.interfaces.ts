import { Types } from 'mongoose';

export enum RentBookingStatus {
  CHECKED_IN = 'checked_in',
  CHECKED_OUT = 'checked_out',
  CANCELLED = 'cancelled',
  REJECTED = 'rejected',
  PENDING = 'pending',
}

export interface IRentBooking {
  _id?: Types.ObjectId;
  rent: Types.ObjectId;
  name?: string;
  email?: string;
  phone: string;
  message?: string | null;
  user?: Types.ObjectId | null;
  rentHost?: Types.ObjectId | null;
  status?: RentBookingStatus;
  checkoutDate?: Date | null;
  checkinDate?: Date | null;
  guestCount?: number;
  price?: number;
  updateRole?: string;
  createdAt?: Date;
  updatedAt?: Date;
  userId?: Types.ObjectId;
  role?: string;
  page?: number;
  limit?: number;
  sort?: 1 | -1;
  // Payment fields for SSLCommerz integration
  transactionId?: string | null;
  paymentStatus?: 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED';
  paymentGateway?: string;
  paymentDetails?: any;
}
