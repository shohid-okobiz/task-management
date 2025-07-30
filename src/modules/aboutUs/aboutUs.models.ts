import { model, Model, Schema } from "mongoose";
import IAboutUS from "./aboutUs.interfaces";

const AboutUsSchema = new Schema<IAboutUS>({
  videoUrl: { type: String, default: null },
  description: { type: String, default: null },
});

const AboutUs: Model<IAboutUS> = model<IAboutUS>("AboutUs", AboutUsSchema);

export default AboutUs;
