import { Document, Types } from "mongoose";

interface ICategory extends Document {
  categoryName: string;
  feature: [Types.ObjectId];
  slug:string
}

export interface ICategoryPayload {
  categoryName?: string;
  categoryId?: Types.ObjectId;
  feature?: Types.ObjectId;
}

export default ICategory;
