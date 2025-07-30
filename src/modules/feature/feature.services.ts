import { IFeaturePayload } from "./feature.interfaces";
import FeatureRepositories from "./feature.repositories";
const { createFeature, findAllFeatures, updateFeature, daleteFeature } =
  FeatureRepositories;

const FeatureServices = {
  processCreateFeature: async ({ featureName }: IFeaturePayload) => {
    try {
      const data = await createFeature({ featureName });
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown Error Occurred In create feature service");
      }
    }
  },
  processRetrieveAllFeatures: async () => {
    try {
      const data = await findAllFeatures();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown Error Occurred In Retrieve feature service");
      }
    }
  },
  processUpdateFeature: async (payload: IFeaturePayload) => {
    try {
      const data = await updateFeature(payload);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown Error Occurred In update feature service");
      }
    }
  },
  processDeleteFeature: async (payload: IFeaturePayload) => {
    try {
      const data = await daleteFeature(payload);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown Error Occurred In delete feature service");
      }
    }
  },
};
export default FeatureServices;
