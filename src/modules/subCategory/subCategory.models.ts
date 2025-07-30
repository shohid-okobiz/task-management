import { Model, model, Schema } from "mongoose";
import ISubCategory from "./subCategory.interfaces";

const SubCategorySchema = new Schema<ISubCategory>(
  {
    subCategoryName: { type: String, default: null },
    category: { type: Schema.Types.ObjectId, ref: "Category", default: null },
  },
  { timestamps: true }
);

const SubCategory: Model<ISubCategory> = model<ISubCategory>(
  "SubCategory",
  SubCategorySchema
);

export default SubCategory;
