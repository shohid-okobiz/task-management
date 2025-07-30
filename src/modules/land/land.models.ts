import { HydratedDocument, model, Model, Schema, Types } from 'mongoose';
import ILand, { ListingPublishStatus } from './land.interfaces';
import SlugUtils from '../../utils/slug.utils';

const { generateSlug } = SlugUtils;

const LandSchema = new Schema<ILand>(
  {
    title: { type: String, default: null },
    description: { type: String, default: null },
    location: { type: String, default: null },
    images: { type: [String], default: null },
    video: { type: String, default: null },
    selected: { type: Boolean, default: false },
    price: { type: Number, default: null },
    coverImage: { type: String, default: null },
    category: { type: Types.ObjectId, ref: 'Category', default: null }, 
    listingFor: [{ type: Types.ObjectId, ref: 'Feature' }],
    landSize: { type: Number, default: null },
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

LandSchema.pre('save', async function (next) {
  const land = this as HydratedDocument<ILand>;

  if (land.isModified('title') || land.isNew) {
    try {
      const baseSlug = land.title?.trim() || `listing-${Date.now()}`;
      land.slug = generateSlug(baseSlug);
    } catch (error) {
      if (error instanceof Error) {
        next(error);
      }
    }
  }

  next();
});

 

const Land: Model<ILand> = model<ILand>('Land', LandSchema);

export default Land;
