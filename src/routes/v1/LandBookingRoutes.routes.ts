import { Router } from 'express';
import UserMiddlewares from '../../modules/user/user.middlewares';
import { UserRole } from '../../interfaces/jwtPayload.interfaces';
import LandBookingController from '../../modules/Landbooking/landbooking.controllers';

const router = Router();

const { checkAccessToken, allowRole } = UserMiddlewares;
const {
  handleCreateLandBooking,
  handleGetAllLandBookings,
  handleGetLandBookingById,
  handleUpdateLandBookingStatus,
  handleDeleteLandBooking,
  handleLandBookingStats,
  handleAvailableLandStats,

} = LandBookingController;

// ✅ User creates a land booking
router
  .route('/land/booking')
  .post(checkAccessToken, handleCreateLandBooking);

// ✅ Admin: Get all land bookings
router
  .route('/admin/land/bookings')
  .get(checkAccessToken, allowRole(UserRole.Admin), handleGetAllLandBookings);

// ✅ Admin: Get booking stats
router
  .route('/admin/land/bookings/stats')
  .get(checkAccessToken, allowRole(UserRole.Admin), handleLandBookingStats);
  router
  .route('/admin/land/available')
  .get(checkAccessToken, allowRole(UserRole.Admin), handleAvailableLandStats);


// ✅ Admin: Update booking status
router
  .route('/admin/land/bookings/:id/status')
  .patch(checkAccessToken, allowRole(UserRole.Admin), handleUpdateLandBookingStatus);

// ✅ Admin: Get single booking or delete it
router
  .route('/admin/land/bookings/:id')
  .get(checkAccessToken, allowRole(UserRole.Admin), handleGetLandBookingById)
  .delete(checkAccessToken, allowRole(UserRole.Admin), handleDeleteLandBooking);

export default router;
