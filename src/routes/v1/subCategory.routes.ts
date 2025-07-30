import { Router } from "express";
import UserMiddlewares from "../../modules/user/user.middlewares";
import SubCategoryControllers from "../../modules/subCategory/subCategory.controllers";
import { UserRole } from "../../interfaces/jwtPayload.interfaces";

const { checkAccessToken, allowRole } = UserMiddlewares;
const {
  handleCreateSubCategory,
  handleDeleteSubCategory,
  handleRetrieveSubCategories,
  handleUpdateSubCategory,
} = SubCategoryControllers;
const router = Router();

router
  .route("/admin/sub_category")
  .post(
    checkAccessToken,
    allowRole(UserRole.Admin, UserRole.ContentManager),
    handleCreateSubCategory
  )
  .get(handleRetrieveSubCategories);

router
  .route("/admin/sub_category/:id")
  .put(
    checkAccessToken,
    allowRole(UserRole.Admin, UserRole.ContentManager),
    handleUpdateSubCategory
  )
  .delete(
    checkAccessToken,
    allowRole(UserRole.Admin, UserRole.ContentManager),
    handleDeleteSubCategory
  );

export default router;
