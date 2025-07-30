import { IFaqPayload } from "./faq.interfaces";
import Faq from "./faq.models";

const FaqRepositories = {
  createFaq: async (payload: IFaqPayload) => {
    try {
      const newFaq = new Faq(payload);
      await newFaq.save();
      return newFaq;
    } catch (error) {
      throw new Error("Unknown Error Occurred In Faq Creation Operation");
    }
  },
  findAllFaqs: async () => {
    try {
      const data = await Faq.find({});
      return data;
    } catch (error) {
      throw new Error("Unknown Error Occurred In Faq Retrive Operation");
    }
  },
  updateFaq: async ({ faqAnswer, faqQuestion, faqId }: IFaqPayload) => {
    try {
      const updatedData = await Faq.findByIdAndUpdate(
        faqId,
        { $set: { faqQuestion, faqAnswer } },
        { new: true }
      );
      return updatedData;
    } catch (error) {
      throw new Error("Unknown Error Occurred In Faq update Operation");
    }
  },
  daleteFaq: async ({ faqId }: IFaqPayload) => {
    try {
      const updatedData = await Faq.findByIdAndDelete(faqId);
      if (!updatedData) throw new Error("Faq delete fail");
      return;
    } catch (error) {
      throw new Error("Unknown Error Occurred In Faq update Operation");
    }
  },
};

export default FaqRepositories;
