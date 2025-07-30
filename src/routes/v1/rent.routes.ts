import { Router } from 'express';
import UserMiddlewares from '../../modules/user/user.middlewares';
import RentControllers from '../../modules/rent/rent.controllers';
import upload from '../../middlewares/multer.middleware';
import { UserRole } from '../../interfaces/jwtPayload.interfaces';

const { checkAccessToken, isHost, allowRole } = UserMiddlewares;
const {
  handleInitializeRentListing,
  handleProgressCreatingRentListing,
  handleUploadImage,
  handleUnlinkImage,
  handleGetAllHostListedPropertiesForRent,
  handleRentDateBlockList,
  handleGetRentDateBlockList,
  handleChangeStatus,
  handleGetAllRent,
  handleDeleteListedRentItem,
  handleCreateRent,
  handleRetrieveOneListedRent,
  handleRetrieveOneListedRentById,
  handleGetRentField,
  HandleSearchRentListings,
  handleSetRentSelected

} = RentControllers;
const router = Router();
router
  .route('/host/rent/image/:id')
  .patch(checkAccessToken, isHost, upload.array('images'), handleUploadImage)
  .delete(checkAccessToken, isHost, handleUnlinkImage);

router.route('/host/rent/new').post(checkAccessToken, isHost, handleInitializeRentListing);
router
  .route('/host/create-new-rent')
  .post(checkAccessToken, isHost, upload.array('images'), handleCreateRent);
router.route('/host/rent/:id').patch(checkAccessToken, isHost, handleProgressCreatingRentListing);



router.route('/host/rent').get(checkAccessToken, isHost, handleGetAllHostListedPropertiesForRent);
router.route('/host/rent/date-block-list')
.post(checkAccessToken, isHost, handleRentDateBlockList)
.get( handleGetRentDateBlockList);
router.route('/host/rent/:id').get(checkAccessToken, isHost, handleRetrieveOneListedRentById);

router
  .route('/admin/rent/:id')
  .patch(
    checkAccessToken,
    allowRole(UserRole.Admin, UserRole.ListingVerificationManager),
    handleChangeStatus
  )
  .delete(
    checkAccessToken,
    allowRole(UserRole.Admin, UserRole.ListingVerificationManager),
    handleDeleteListedRentItem
  );

router.route('/rent').get( handleGetAllRent);
router.route('/rent/:slug').get(handleRetrieveOneListedRent);
router
  .route('/host/rent/:id/field/:field')
  .get(checkAccessToken, isHost, handleGetRentField);
router.route('/rent-search').get(HandleSearchRentListings);
router.route('/admin/rent/:id/select').patch( checkAccessToken, allowRole(UserRole.Admin), handleSetRentSelected);

export default router;
