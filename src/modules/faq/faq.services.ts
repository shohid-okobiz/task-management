import { IFaqPayload } from "./faq.interfaces";
import FaqRepositories from "./faq.repositories";

const { createFaq, daleteFaq, findAllFaqs, updateFaq } = FaqRepositories;

const FaqServices = {
  processCreateFaq: async ({ faqQuestion, faqAnswer }: IFaqPayload) => {
    try {
      const data = await createFaq({ faqQuestion, faqAnswer });
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown Error Occurred In create faq service");
      }
    }
  },
  processRetrieveAllFaqs: async () => {
    try {
      const data = await findAllFaqs();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown Error Occurred In Retrieve faq service");
      }
    }
  },
  processUpdateFaq: async (payload: IFaqPayload) => {
    try {
      const data = await updateFaq(payload);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown Error Occurred In update faq service");
      }
    }
  },
  processDeleteFaq: async (payload: IFaqPayload) => {
    try {
      const data = await daleteFaq(payload);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown Error Occurred In delete faq service");
      }
    }
  },
};

export default FaqServices;
