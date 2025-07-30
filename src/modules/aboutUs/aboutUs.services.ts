import AboutUsRepositories from "./aboutUs.repositories";
import { IAboutUsPayload } from "./aboutUs.interfaces";

const { createAboutUs, daleteAboutUs, findAllAboutUs, updateAboutUs } =
  AboutUsRepositories;
const AboutUsServices = {
  processCreateAboutUs: async (payload: IAboutUsPayload) => {
    try {
      const data = await createAboutUs(payload);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown Error Occurred In create AboutUs service");
      }
    }
  },
  processUpdateAboutUs: async (payload: IAboutUsPayload) => {
    try {
      const data = await updateAboutUs(payload);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown Error Occurred In update AboutUs service");
      }
    }
  },
  processRetriveAboutUs: async () => {
    try {
      const data = await findAllAboutUs();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown Error Occurred In Retrieve AboutUs service");
      }
    }
  },
  processDeleteAboutUs: async (payload: IAboutUsPayload) => {
    try {
      const data = await daleteAboutUs(payload);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown Error Occurred In delete AboutUs service");
      }
    }
  },
};

export default AboutUsServices;
