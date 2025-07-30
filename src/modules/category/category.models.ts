import { HydratedDocument, Model, model, Schema } from 'mongoose';
import ICategory from './category.interfaces';
import SlugUtils from '../../utils/slug.utils';
const { generateSlug } = SlugUtils;

const CategorySchema = new Schema<ICategory>(
  {
    categoryName: { type: String, default: null },
    slug: { type: String, default: null },
    feature: [{ type: Schema.Types.ObjectId, ref: 'Feature', required: true }],
  },
  { timestamps: true }
);

CategorySchema.pre('save', function (next) {
  const category = this as HydratedDocument<ICategory>;
  if ((category.isModified('categoryName') || category.isNew) && category.categoryName) {
    try {
      category.slug = generateSlug(category?.categoryName as string);
    } catch (error) {
      if (error instanceof Error) {
        next(error);
      }
    }
  }
  next();
});

const Category: Model<ICategory> = model<ICategory>('Category', CategorySchema);

export default Category;
