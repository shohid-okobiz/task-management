import { model, Model, Schema } from "mongoose";
import IFaq from "./faq.interfaces";

const FaqSchema = new Schema<IFaq>(
  {
    faqQuestion: { type: String, default: null },
    faqAnswer: { type: String, default: null },
  },
  { timestamps: true }
);

const Faq: Model<IFaq> = model<IFaq>("Faq", FaqSchema);

export default Faq;
