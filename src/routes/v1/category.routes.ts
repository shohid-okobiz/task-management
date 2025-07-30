import { Router } from "express";
import UserMiddlewares from "../../modules/user/user.middlewares";
import CategoryControllers from "../../modules/category/category.controllers";
import { UserRole } from "../../interfaces/jwtPayload.interfaces";

const { checkAccessToken, allowRole } = UserMiddlewares;
const {
  handleCreateCategory,
  handleUpdateCategory,
  handleRetrieveCategories,
  handleDeleteCategory,
} = CategoryControllers;
const router = Router();

router
  .route("/admin/category")
  .post(
    checkAccessToken,
    allowRole(UserRole.Admin, UserRole.ContentManager),
    handleCreateCategory
  )
  .get(handleRetrieveCategories);

router
  .route("/admin/category/:id")
  .put(
    checkAccessToken,
    allowRole(UserRole.Admin, UserRole.ContentManager),
    handleUpdateCategory
  )
  .delete(
    checkAccessToken,
    allowRole(UserRole.Admin, UserRole.ContentManager),
    handleDeleteCategory
  );

export default router;
