import { Document, Types } from "mongoose";

export interface IFaqPayload{
    faqAnswer?:string;
    faqQuestion?:string;
    faqId?:Types.ObjectId
}

interface IFaq extends Document{
    faqAnswer:string;
    faqQuestion:string;
}

export default IFaq;