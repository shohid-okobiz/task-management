
import { ICategoryPayload } from './category.interfaces';
import { Category } from './category.models';

const CategoryRepositories = {
  createCategory: async (payload: ICategoryPayload) => {
    try {
      const newCategory = new Category({ name: payload.name });
      await newCategory.save();
      return newCategory;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Category Creation Operation');
      }
    }
  },
  findCategories: async () => {
    try {
      const data = await Category.find();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Category Retrieve Operation');
      }
    }
  },
 
};

export default CategoryRepositories;
