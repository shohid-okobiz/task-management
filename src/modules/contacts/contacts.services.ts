import mailTransporter from "../../configs/nodemailer.configs";
import { env } from "../../env";
import {
  IContactsPayload,
  IFindQuery,
  IGetAllContactsPayload,
  IGetAllContactsQuery,
} from "./contacts.interfaces";
import ContactsRepositories from "./contacts.repositories";
const { createContactMessage, deleteOneContactMessage, findContactMessages } =
  ContactsRepositories;

const ContactsServices = {
  processCreateContactMessage: async ({
    email,
    message,
    name,
    phone,
    subject,
  }: IContactsPayload) => {
    try {
      await createContactMessage({
        email,
        message,
        name,
        phone,
        subject,
      });
      await mailTransporter.sendMail({
        from: env.SMTP_USER,
        to: env.SMTP_USER,
        replyTo:email,
        subject,
        text: message,
      });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(
          "Unknown Error Occurred In Create Contact Message Service"
        );
      }
    }
  },
  processDeleteContactMessage: async ({
    contactMessageId,
  }: IContactsPayload) => {
    try {
      return await deleteOneContactMessage({ contactMessageId });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(
          "Unknown Error Occurred In Delete Contact Message Service"
        );
      }
    }
  },
  processFindAllContactsMessages: async ({
    page,
    search,
    sort,
  }: IGetAllContactsQuery) => {
    try {
      const query: IFindQuery = {};
      if (search) query.email = search;
      const payload: IGetAllContactsPayload = { query };
      if (page) payload.page = page;
      if (sort) payload.sort = sort;
      return findContactMessages(payload);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(
          "Unknown Error Occurred Find All Listed Contacts Messages Service"
        );
      }
    }
  },
};

export default ContactsServices;
