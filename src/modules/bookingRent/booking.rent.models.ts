import { model, Schema, Types } from 'mongoose';

const BookingRentSchema = new Schema({
  user_id: { type: Types.ObjectId, ref: 'User', required: true },
  rent_id: { type: Types.ObjectId, ref: 'Rent', required: true },
  checkIn: { type: Date, required: true },
  checkout: { type: Date, require: true },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  paymentMethod: { type: String, enum: ['card', 'bkash', 'rocket', 'bank_transfer'], default: 'bkash' },
  paymentStatus: { type: String, enum: ['paid', 'unpaid'], default: 'unpaid' },
  paymentId: { type: String, default: null },
});


const BookingRent = model('BookingRent', BookingRentSchema);

export default BookingRent;
