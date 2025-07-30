import { Router } from "express";
import UserMiddlewares from "../../modules/user/user.middlewares";
import FeatureControllers from "../../modules/feature/feature.controllers";
import { UserRole } from "../../interfaces/jwtPayload.interfaces";
const { checkAccessToken, allowRole } = UserMiddlewares;
const {
  handleCreateFeature,
  handleRetrieveAllFeature,
  handleUpdateFeature,
  handleDeleteFeature,
} = FeatureControllers;

const router = Router();

router
  .route("/admin/feature")
  .post(
    checkAccessToken,
    allowRole(UserRole.Admin, UserRole.ContentManager),
    handleCreateFeature
  )
  .get(handleRetrieveAllFeature);

router
  .route("/admin/feature/:id")
  .put(
    checkAccessToken,
    allowRole(UserRole.Admin, UserRole.ContentManager),
    handleUpdateFeature
  )
  .delete(
    checkAccessToken,
    allowRole(UserRole.Admin, UserRole.ContentManager),
    handleDeleteFeature
  );

export default router;
