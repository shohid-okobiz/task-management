import { ISubCategoryPayload } from "./subCategory.interfaces";
import SubCategory from "./subCategory.models";

const SubCategoryRepositories = {
  createSubCategory: async (payload: ISubCategoryPayload) => {
    try {
      const data = new SubCategory(payload);
      await data.save();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(
          "Unknown Error Occurred In Sub Category Creation Operation"
        );
      }
    }
  },
  findSubCategories: async ({ category }: ISubCategoryPayload) => {
    try {
      const query = category ? { category } : {};
      const data = await SubCategory.find(query).populate(
        "category",
        "categoryName _id"
      );
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(
          "Unknown Error Occurred In Sub Category Retrieve Operation"
        );
      }
    }
  },
  updateSubCategory: async ({
    subCategoryId,
    category,
    subCategoryName,
  }: ISubCategoryPayload) => {
    try {
      const data = await SubCategory.findByIdAndUpdate(
        subCategoryId,
        { $set: { category, subCategoryName } },
        { new: true }
      );
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(
          "Unknown Error Occurred In sub category update Operation"
        );
      }
    }
  },
  deleteSubCategory: async ({ subCategoryId }: ISubCategoryPayload) => {
    try {
      const data = await SubCategory.findByIdAndDelete(subCategoryId);
      if (!data) throw new Error("sub category delete fail");
      return;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(
          "Unknown Error Occurred In sub category delete Operation"
        );
      }
    }
  },
};

export default SubCategoryRepositories;
