import { ISubCategoryPayload } from "./subCategory.interfaces";
import SubCategoryRepositories from "./subCategory.repositories";

const {
  createSubCategory,
  deleteSubCategory,
  findSubCategories,
  updateSubCategory,
} = SubCategoryRepositories;
const SubCategoryServices = {
  processCreateSubCategory: async (payload: ISubCategoryPayload) => {
    try {
      const data = await createSubCategory(payload);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown Error Occurred In create feature service");
      }
    }
  },
  processUpdateSubCategory: async (payload: ISubCategoryPayload) => {
    try {
      const data = await updateSubCategory(payload);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(
          "Unknown Error Occurred In update sub category service"
        );
      }
    }
  },
  processRetrieveSubCategory: async (payload: ISubCategoryPayload) => {
    try {
      const data = await findSubCategories(payload);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(
          "Unknown Error Occurred In Retrieve Sub Category service"
        );
      }
    }
  },
  processDeleteSubCategory: async (payload: ISubCategoryPayload) => {
    try {
      return await deleteSubCategory(payload);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(
          "Unknown Error Occurred In delete sub category service"
        );
      }
    }
  },
};

export default SubCategoryServices;
