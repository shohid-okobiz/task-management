import { Types } from "mongoose";

interface IContacts {
  name?: string;
  phone?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export interface IContactsPayload {
  name?: string;
  phone?: string;
  email?: string;
  subject?: string;
  message?: string;
  contactMessageId?: Types.ObjectId;
}

export interface IGetAllContactsQuery {
  search?: string;
  page?: number;
  sort?: 1 | -1;
}
export interface IFindQuery {
  email?: string;
}
export interface IGetAllContactsPayload {
  query: IFindQuery;
  page?: number;
  sort?: 1 | -1;
}

export default IContacts;
