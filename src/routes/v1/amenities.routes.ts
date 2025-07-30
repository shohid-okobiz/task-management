import { Router } from "express";
import AmenitiesControllers from "../../modules/amenities/amenities.controllers";
import UserMiddlewares from "../../modules/user/user.middlewares";
import AmenitiesMiddlewares from "../../modules/amenities/amenities.middlewares";
import upload from "../../middlewares/multer.middleware";
import { UserRole } from "../../interfaces/jwtPayload.interfaces";
const { checkAccessToken, allowRole } = UserMiddlewares;
const { isAmenitiesExist } = AmenitiesMiddlewares;
const {
  handleCreateAmenities,
  handleDeleteAmenities,
  handleRetrieveAllAmenities,
  handleUpdateAmenities,
  handleUpdateAmenitiesField,
} = AmenitiesControllers;
const router = Router();

router
  .route("/admin/amenities")
  .get(handleRetrieveAllAmenities)
  .post(
    checkAccessToken,
    allowRole(UserRole.Admin, UserRole.ContentManager),
    upload.single("amenitiesImage"),
    handleCreateAmenities
  );
router
  .route("/admin/amenities/:id")
  .put(
    checkAccessToken,
    allowRole(UserRole.Admin, UserRole.ContentManager),
    isAmenitiesExist,
    upload.single("amenitiesImage"),
    handleUpdateAmenities
  )
  .patch(
    checkAccessToken,
    allowRole(UserRole.Admin, UserRole.ContentManager),
    handleUpdateAmenitiesField
  )
  .delete(
    checkAccessToken,
    allowRole(UserRole.Admin, UserRole.ContentManager),
    isAmenitiesExist,
    handleDeleteAmenities
  );

export default router;
