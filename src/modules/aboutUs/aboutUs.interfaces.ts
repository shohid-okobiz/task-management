import { Document, Types } from "mongoose";

interface IAboutUs extends Document {
  videoUrl: string;
  description: string;
}

export interface IAboutUsPayload {
  id?: Types.ObjectId;
  videoUrl?: string;
  description?: string;
}

export default IAboutUs;
