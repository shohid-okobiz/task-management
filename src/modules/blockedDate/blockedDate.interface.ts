import { Types } from 'mongoose';

export interface IBlockedDate {
  _id?: Types.ObjectId;
  rent: Types.ObjectId | string;
  startDate: Date;
  endDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
