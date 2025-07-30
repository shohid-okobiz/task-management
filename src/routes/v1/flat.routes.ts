import { Router } from 'express';
import UserMiddlewares from '../../modules/user/user.middlewares';
import upload from '../../middlewares/multer.middleware';
import FlatControllers from '../../modules/flat/flat.controllers';
import { UserRole } from '../../interfaces/jwtPayload.interfaces';

const { checkAccessToken, isHost, allowRole } = UserMiddlewares;
const {
  handleInitializeFlatListing,
  handleUpdateFlatListingField,
  handleUploadImage,
  handleUnlinkImage,
  handleGetAllHostListedPropertiesForFlat,
  handleGetAllFlat,
  handleDeleteListedFlatItem,
  handleChangeStatus,
  handleCreateFlat,
  handleRetrieveOneListedFlat,
  handleRetrieveOneListedFlatById,
  handleGetFlatField,
  handleSetFlattSelected 
} = FlatControllers;

const router = Router();

// HOST ROUTES
router.route('/host/flat/new').post(checkAccessToken, isHost, handleInitializeFlatListing);
router
  .route('/host/create-new-flat')
  .post(checkAccessToken, isHost, upload.array('images'), handleCreateFlat);
router.route('/host/flat/:id').patch(checkAccessToken, isHost, handleUpdateFlatListingField);
router
  .route('/host/flat/image/:id')
  .patch(checkAccessToken, isHost, upload.array('images'), handleUploadImage);
router.route('/host/flat/image/:id').delete(checkAccessToken, isHost, handleUnlinkImage);
router.route('/host/flat').get(checkAccessToken, isHost, handleGetAllHostListedPropertiesForFlat);
router.route('/host/flat/:id').get(checkAccessToken, isHost, handleRetrieveOneListedFlatById);

// COMMON GET ALL LISTED FLAT ENDPOINT
router.route('/flat').get(handleGetAllFlat);
router.route('/flat/:slug').get(handleRetrieveOneListedFlat);

// ADMIN ROUTES
router
  .route('/admin/flat/:id')
  .patch(
    checkAccessToken,
    allowRole(UserRole.Admin, UserRole.ListingVerificationManager),
    handleChangeStatus
  )
  .delete(
    checkAccessToken,
    allowRole(UserRole.Admin, UserRole.ListingVerificationManager),
    handleDeleteListedFlatItem
  );
   router
  .route('/host/land/:id/field/:field')
  .get(checkAccessToken, isHost, handleGetFlatField);
  router.route('/admin/flat/:id/select').patch( checkAccessToken, allowRole(UserRole.Admin), handleSetFlattSelected);

export default router;
