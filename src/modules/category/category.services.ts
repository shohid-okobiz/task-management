import { ICategoryPayload } from "./category.interfaces";
import CategoryRepositories from "./category.repositories";
const { createCategory, updateCategory, findCategories, deleteCategory } =
  CategoryRepositories;
const CategoryServices = {
  processCreateCategory: async (payload: ICategoryPayload) => {
    try {
      const data = await createCategory(payload);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown Error Occurred In create  category service");
      }
    }
  },
  processUpdateCategory: async (payload: ICategoryPayload) => {
    try {
      const data = await updateCategory(payload);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown Error Occurred In update category service");
      }
    }
  },
  processRetrieveCategory: async (payload: ICategoryPayload) => {
    try {
      const data = await findCategories(payload);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown Error Occurred In Retrieve Category service");
      }
    }
  },
  processDeleteCategory: async (payload: ICategoryPayload) => {
    try {
      const data = await deleteCategory(payload);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown Error Occurred In delete category service");
      }
    }
  },
};

export default CategoryServices;
