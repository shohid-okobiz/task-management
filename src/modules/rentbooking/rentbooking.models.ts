import { Schema, model, Model } from 'mongoose';
import { IRentBooking, RentBookingStatus } from './rentbooking.interfaces';

const RentBookingSchema = new Schema<IRentBooking>(
  {
    rent: { type: Schema.Types.ObjectId, ref: 'Rent', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    rentHost: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    checkinDate: { type: Date, default: null },
    checkoutDate: { type: Date, default: null },
    guestCount: { type: Number, default: 1 },
    price: { type: Number, default: 0 },
    status: {
      type: String,
      enum: Object.values(RentBookingStatus),
      default: RentBookingStatus.PENDING,
    },
    updateRole: { type: String, default: 'host' },
  },
  {
    timestamps: true
  }
);

// Add payment-related fields
RentBookingSchema.add({
  transactionId: { type: String, default: null },
  paymentStatus: { type: String, enum: ['PENDING', 'SUCCESS', 'FAILED', 'CANCELLED'], default: 'PENDING' },
  paymentGateway: { type: String, default: 'SSLCommerz' },
  paymentDetails: { type: Object, default: null }, 
});

RentBookingSchema.index({ rent: 1, email: 1 }, { unique: false });

const RentBooking: Model<IRentBooking> = model<IRentBooking>('RentBooking', RentBookingSchema);

export default RentBooking;
