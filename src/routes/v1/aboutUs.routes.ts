import { Router } from "express";
import UserMiddlewares from "../../modules/user/user.middlewares";
import AboutUsControllers from "../../modules/aboutUs/aboutUs.controllers";
import { UserRole } from "../../interfaces/jwtPayload.interfaces";

const { checkAccessToken, allowRole } = UserMiddlewares;
const {
  handleCreateAboutUs,
  handleDeleteAboutUs,
  handleRetriveAboutUs,
  handleUpdateAboutUs,
} = AboutUsControllers;

const router = Router();

router
  .route("/admin/about_us")
  .post(
    checkAccessToken,
    allowRole(UserRole.Admin, UserRole.ContentManager),
    handleCreateAboutUs
  )
  .get(handleRetriveAboutUs);

router
  .route("/admin/about_us/:id")
  .put(
    checkAccessToken,
    allowRole(UserRole.Admin, UserRole.ContentManager),
    handleUpdateAboutUs
  )
  .delete(
    checkAccessToken,
    allowRole(UserRole.Admin, UserRole.ContentManager),
    handleDeleteAboutUs
  );
export default router;
