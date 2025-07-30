import { model, Model, Schema } from "mongoose";
import IContacts from "./contacts.interfaces";

const ContactsSchema = new Schema<IContacts>(
  {
    email: { type: String, default: null },
    message: { type: String, default: null },
    name: { type: String, default: null },
    phone: { type: String, default: null },
    subject: { type: String, default: null },
  },
  { timestamps: true }
);

const Contacts: Model<IContacts> = model<IContacts>("Contacts", ContactsSchema);

export default Contacts;
