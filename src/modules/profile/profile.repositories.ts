import mongoose, { Types } from "mongoose";
import {
  IAvatar,
  IBio,
  IChangeUserStatus,
  IChangeUserStatusRepository,
  ICreateLanguagePayload,
  ICreateLocationPayload,
  IGetAllUserPayload,
  IGetAllUserQuery,
  IIdentityDocumentPayload,
  IWorksAtPayload,
} from "./profile.interfaces";
import Profile from "./profile.models";
import User from "../user/user.model";
 
import { documentPerPage } from "../../const";
import { IIdentityDocument, IUser } from "../user/user.interfaces";

const ProfileRepositories = {
  findFullProfile: async (userId: Types.ObjectId) => {
    try {
      const profile = await Profile.findOne({ user: userId }).populate("user", "-password");
      return profile;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown Error Occurred In Find Full Profile Repository");
      }
    }
  },
  createWorksAt: async ({ id, worksAt }: IWorksAtPayload) => {
    try {
      const data = await Profile.findOneAndUpdate(
        { user: id },
        { worksAt },
        { new: true, select: "worksAt" }
      );
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(
          "Unknown Error Occurred In Profile WorksAt Creation Operation"
        );
      }
    }
  },
  findWorksAt: async (payload: Types.ObjectId) => {
    try {
      const data = await Profile.findOne({ user: payload }).select(
        "worksAt -_id"
      );
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(
          "Unknown Error Occurred In Profile WorksAt find Operation"
        );
      }
    }
  },
  createUserLocation: async ({ id, location }: ICreateLocationPayload) => {
    try {
      const data = await Profile.findOneAndUpdate(
        { user: id },
        { location },
        { new: true, select: "location -_id" }
      );
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(
          "Unknown Error Occurred In Profile Create Location Operation"
        );
      }
    }
  },
  findLocation: async (payload: Types.ObjectId) => {
    try {
      const data = await Profile.findOne({ user: payload }).select(
        "location -_id"
      );
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(
          "Unknown Error Occurred In Profile location find Operation"
        );
      }
    }
  },
  createLanguage: async ({ id, languages }: ICreateLanguagePayload) => {
    try {
      console.log(id, languages);
      const data = await Profile.findOneAndUpdate(
        { user: id },
        { languages: languages },
        { new: true, select: "languages -_id" }
      );
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(
          "Unknown Error Occurred In Profile Create Language Operation"
        );
      }
    }
  },
  findLanguage: async (payload: Types.ObjectId) => {
    try {
      const data = await Profile.findOne({ user: payload }).select(
        "languages -_id"
      );
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(
          "Unknown Error Occurred In Profile Language find Operation"
        );
      }
    }
  },
  createBio: async ({ id, intro }: IBio) => {
    try {
      console.log(id, intro);
      const data = await Profile.findOneAndUpdate(
        { user: id },
        { intro },
        { new: true, select: "intro -_id" }
      );
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(
          "Unknown Error Occurred In Profile Create Bio Operation"
        );
      }
    }
  },
  findBio: async (payload: Types.ObjectId) => {
    try {
      const data = await Profile.findOne({ user: payload }).select(
        "intro -_id"
      );
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown Error Occurred In Profile Bio find Operation");
      }
    }
  },
  createAvatar: async ({ avatar, id }: IAvatar) => {
    try {
      const data = await User.findOneAndUpdate(
        { _id: id },
        { avatar },
        { new: true, select: "avatar -_id" }
      );
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(
          "Unknown Error Occurred In Profile Create Avatar Operation"
        );
      }
    }
  },
  findAvatar: async (payload: Types.ObjectId) => {
    try {
      const data = await User.findById(payload).select("avatar -_id");
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(
          "Unknown Error Occurred In Profile avatar find Operation"
        );
      }
    }
  },
 
  getAllUsers: async ({ query, page, sort }: IGetAllUserPayload) => {
    try {
      const currentPage = page ?? 1;
      const skip = (currentPage - 1) * documentPerPage;
      const sortValue = Number(sort);
        const sortOption: Record<string, 1 | -1> =
  sortValue === 1 || sortValue === -1
    ? { createdAt: sortValue as 1 | -1 }
    : { createdAt: -1 };
      query.isStaff = false;
      console.log("sortOption:", sortOption);
      const [data, total] = await Promise.all([
        User.find(query)
          .limit(documentPerPage)
          .skip(skip)
          .sort(sortOption)
          .populate({
            path: "identityDocument",
            select: "_id documentType frontSide backSide",
          }),
        User.countDocuments(query),
      ]);
      return { data, total };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(
          "Unknown Error Occurred In get all pending identity request Operation"
        );
      }
    }
  },
 
};

export default ProfileRepositories;
