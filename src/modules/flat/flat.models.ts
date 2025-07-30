import { HydratedDocument, model, Model, Schema, Types } from 'mongoose';
import IFlat, { IFlatFloorPlan, ListingPublishStatus } from './flat.interfaces';
import SlugUtils from '../../utils/slug.utils';

const { generateSlug } = SlugUtils;

const FloorPlanSchema = new Schema<IFlatFloorPlan>(
  {
    unitCount: { type: Number, default: 0 },
    drawing: { type: Boolean, default: false },
    dinning: { type: Boolean, default: false },
    balconyCount: { type: Number, default: 0 },
    bedroomCount: { type: Number, default: 0 },
    bathroomCount: { type: Number, default: 0 },
  },
  { _id: false }
);

const FlatSchema = new Schema<IFlat>(
  {
    title: { type: String, default: null },
    description: { type: String, default: null },
    location: { type: String, default: null },
    selected: { type: Boolean, default: false },
    images: { type: [String], default: null },
    video: { type: String, default: null },
    price: { type: Number, default: null },
    coverImage: { type: String, default: null },
    category: { type: Types.ObjectId, ref: 'Category', default: null },
    listingFor: [{ type: Types.ObjectId, ref: 'Feature', default: null }],
    buildingYear: { type: String, default: null },
    floorPlan: {
      type: FloorPlanSchema,
      default: {
        unitCount: 0,
        drawing: false,
        dinning: false,
        balconyCount: 0,
        bedroomCount: 0,
        bathroomCount: 0,
      },
    },
    amenities: [{ type: Types.ObjectId, ref: 'Amenities', default: null }],
    host: { type: Types.ObjectId, ref: 'User', required: true },
    publishStatus: {
      type: String,
      enum: ListingPublishStatus,
      default: ListingPublishStatus.IN_PROGRESS,
    },
    slug: {
      type: String,
      index: {
        unique: true,
        partialFilterExpression: { slug: { $type: 'string' } },
      },
    },
    isSold: { type: Boolean, default: false },
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
  },
  { timestamps: true }
);

 
FlatSchema.pre('save', async function (next) {
  const flat = this as HydratedDocument<IFlat>;

  if (flat.isModified('title') || flat.isNew) {
    try {
      const baseSlug = flat.title?.trim() || `listing-${Date.now()}`;
      flat.slug = generateSlug(baseSlug);
    } catch (error) {
      if (error instanceof Error) {
        next(error);
      }
    }
  }

  next();
});

const Flat: Model<IFlat> = model<IFlat>('Flat', FlatSchema);

export default Flat;
