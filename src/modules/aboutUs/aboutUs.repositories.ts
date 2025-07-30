import { IAboutUsPayload } from "./aboutUs.interfaces";
import AboutUs from "./aboutUs.models";

const AboutUsRepositories = {
  findAllAboutUs: async () => {
    try {
      const data = await AboutUs.find({});
      return data;
    } catch (error) {
      throw new Error(
        "Unknown Error Occurred In About Us Retrieve Creation Operation"
      );
    }
  },
  createAboutUs: async (payload: IAboutUsPayload) => {
    try {
      const data = new AboutUs(payload);
      await data.save();
      return data;
    } catch (error) {
      throw new Error("Unknown Error Occurred In About Us Creation Operation");
    }
  },
  updateAboutUs: async ({ description, id, videoUrl }: IAboutUsPayload) => {
    try {
      const data = await AboutUs.findByIdAndUpdate(
        id,
        { $set: { description, videoUrl } },
        { new: true }
      );
      return data;
    } catch (error) {
      throw new Error("Unknown Error Occurred In About Us Update Operation");
    }
  },
  daleteAboutUs: async ({ id }: IAboutUsPayload) => {
    try {
      const data = await AboutUs.findByIdAndDelete(id);
      if (!data) throw new Error("About Us delete failed");
      return;
    } catch (error) {
      throw new Error("Unknown Error Occurred In About Us Delete Operation");
    }
  },
};

export default AboutUsRepositories;
