import { Schema, model } from 'mongoose';
import { IBlockedDate } from './blockedDate.interface';

const blockedDateSchema = new Schema<IBlockedDate>(
  {
    rent: { type: Schema.Types.ObjectId, ref: 'Rent', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  },
  { timestamps: true }
);

const BlockedDate = model<IBlockedDate>('BlockedDate', blockedDateSchema);
export default BlockedDate;