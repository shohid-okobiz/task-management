import { Document, Types } from "mongoose";

export interface IFeaturePayload {
  featureName?: string;
  featureId?: Types.ObjectId;
}

interface IFeatureInterfces extends Document {
  featureName: string;
}

export default IFeatureInterfces;
