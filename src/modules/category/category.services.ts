import { ICategoryPayload } from "./category.interfaces";
import CategoryRepositories from "./category.repositories";
const { createCategory, findCategories, } =
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
 
  processRetrieveCategory: async () => {
    try {
      const data = await findCategories();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown Error Occurred In Retrieve Category service");
      }
    }
  },
  
};

export default CategoryServices;
