import { Document, Types } from "mongoose";

interface ISubCategory extends Document {
  subCategoryName: string;
  category: Types.ObjectId;
}

export interface ISubCategoryPayload {
  subCategoryName?: string;
  category?: Types.ObjectId;
  subCategoryId?: Types.ObjectId;
}

export default ISubCategory;
