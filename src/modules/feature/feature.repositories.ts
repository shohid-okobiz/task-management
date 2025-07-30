import { IFeaturePayload } from "./feature.interfaces";
import Feature from "./feature.models";

const FeatureRepositories = {
  createFeature: async (payload: IFeaturePayload) => {
    try {
      const newFeature = new Feature(payload);
      await newFeature.save();
      return newFeature;
    } catch (error) {
      throw new Error("Unknown Error Occurred In Feature Creation Operation");
    }
  },
  findAllFeatures: async () => {
    try {
      const data = await Feature.find({});
      return data;
    } catch (error) {
      throw new Error("Unknown Error Occurred In Feature Retrive Operation");
    }
  },
  updateFeature: async ({ featureId, featureName }: IFeaturePayload) => {
    try {
      const updatedData = await Feature.findByIdAndUpdate(
        featureId,
        { $set: { featureName } },
        { new: true }
      );
      return updatedData;
    } catch (error) {
      throw new Error("Unknown Error Occurred In Feature update Operation");
    }
  },
  daleteFeature: async ({ featureId, featureName }: IFeaturePayload) => {
    try {
      const updatedData = await Feature.findByIdAndDelete(featureId);
      if (!updatedData) throw new Error("Feature delete fail");
      return;
    } catch (error) {
      throw new Error("Unknown Error Occurred In Feature update Operation");
    }
  },
};
export default FeatureRepositories;
