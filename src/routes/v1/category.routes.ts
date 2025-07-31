import { Router } from "express";

import CategoryControllers from "../../modules/category/category.controllers";
import UserMiddlewares from "../../modules/user/user.middlewares";


const { checkAccessToken, } = UserMiddlewares;
const {
  handleCreateCategory,
  handleRetrieveCategories,
  
} = CategoryControllers;
const router = Router();

router
  .route("/category")
  .post( checkAccessToken,handleCreateCategory
  )
  .get(checkAccessToken,handleRetrieveCategories);

 

export default router;
