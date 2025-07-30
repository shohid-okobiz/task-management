import { Model, model, Schema } from "mongoose";
import IAmenities from "./amenities.interfaces";

const AmenitiesSchema = new Schema<IAmenities>(
  {
    amenitiesLabel: { type: String },
    amenitiesImage: { type: String },
  },
  { timestamps: true }
);

const Amenities: Model<IAmenities> = model<IAmenities>(
  "Amenities",
  AmenitiesSchema
);

export default Amenities;
