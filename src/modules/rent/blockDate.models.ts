import { HydratedDocument, model, Model, Schema, Types } from 'mongoose';
import SlugUtils from '../../utils/slug.utils';
import { IBlockdate } from './rent.interfaces';


const BlockdateSchema = new Schema<IBlockdate>({
  rent: { type: Types.ObjectId, ref: 'Rent', require: true },
  blockDate: { type: Date, default: null },

});



BlockdateSchema.index(
  { category: 1 },
  { unique: true, partialFilterExpression: { category: { $type: 'objectId' } } }
);
const Blockdate: Model<IBlockdate> = model<IBlockdate>('Blockdate', BlockdateSchema);

export default Blockdate;
