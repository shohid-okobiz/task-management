import { Document, Types } from "mongoose";

interface IAmenities extends Document {
  amenitiesLabel: string;
  amenitiesImage: string;
}

export interface IAmenitiesPayload {
  amenitiesLabel?: string;
  amenitiesImage?: string;
  amenitiesOldImage?: string;
  amenitiesId?: Types.ObjectId;
}

export default IAmenities;
