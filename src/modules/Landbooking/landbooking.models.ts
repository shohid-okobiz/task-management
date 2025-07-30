import { Schema, model, Model } from 'mongoose';
import { ILandBooking, LandBookingStatus } from './landbooking.interfaces';

const LandBookingSchema = new Schema<ILandBooking>(
  {
    land: { type: Schema.Types.ObjectId, ref: 'Land', required: true },
    name: { type: String },
    email: { type: String },
    phone: { type: String, required: true },
    message: { type: String, default: null },
    user: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    status: {
      type: String,
      enum: Object.values(LandBookingStatus),
      default: LandBookingStatus.AVAILABLE,
    },
  },
  { timestamps: true }
);

LandBookingSchema.index({ land: 1, email: 1 }, { unique: false });

const LandBooking: Model<ILandBooking> = model<ILandBooking>('LandBooking', LandBookingSchema);

export default LandBooking;
