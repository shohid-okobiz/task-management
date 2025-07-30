import { Router } from "express";
import UserMiddlewares from "../../modules/user/user.middlewares";
import FaqControllers from "../../modules/faq/faq.controllers";
import { UserRole } from "../../interfaces/jwtPayload.interfaces";
const { checkAccessToken, allowRole } = UserMiddlewares;
const {
  handleCreateFaq,
  handleDeleteFaq,
  handleRetrieveAllFaq,
  handleUpdateFaq,
} = FaqControllers;

const router = Router();

router
  .route("/admin/faq")
  .post(
    checkAccessToken,
    allowRole(UserRole.Admin, UserRole.ContentManager),
    handleCreateFaq
  )
  .get(handleRetrieveAllFaq);

router
  .route("/admin/faq/:id")
  .put(
    checkAccessToken,
    allowRole(UserRole.Admin, UserRole.ContentManager),
    handleUpdateFaq
  )
  .delete(
    checkAccessToken,
    allowRole(UserRole.Admin, UserRole.ContentManager),
    handleDeleteFaq
  );

export default router;
