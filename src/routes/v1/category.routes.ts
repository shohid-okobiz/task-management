import { Router } from "express";

import CategoryControllers from "../../modules/category/category.controllers";



const {
  handleCreateCategory,
  handleRetrieveCategories,
  
} = CategoryControllers;
const router = Router();

router
  .route("/category")
  .post(
    handleCreateCategory
  )
  .get(handleRetrieveCategories);

 

export default router;
