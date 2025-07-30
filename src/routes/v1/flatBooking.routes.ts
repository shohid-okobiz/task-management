import { Router } from 'express';
import FlatBookingController from '../../modules/flatbooking/flatbooking.controllers';
import UserMiddlewares from '../../modules/user/user.middlewares';
import { UserRole } from '../../interfaces/jwtPayload.interfaces';

const router = Router();
const {
  handleCreateFlatBooking,
  handleGetAllFlatBookings,
  handleGetFlatBookingById,
  handleUpdateFlatBookingStatus,
  handleDeleteFlatBooking,
  handleFlatBookingStats,
  handleAvailableFlatStats,
  handleSoldOutFlatStats,
} = FlatBookingController;

const { checkAccessToken, allowRole } = UserMiddlewares;

// USER: Create booking
router
  .route('/flat/booking')
  .post(checkAccessToken, handleCreateFlatBooking);

// ADMIN: Get all bookings
router
  .route('/admin/flat/bookings')
  .get(checkAccessToken, allowRole(UserRole.Admin), handleGetAllFlatBookings);

// ADMIN: Get single booking / Delete booking
router
  .route('/admin/flat/bookings/:id')
  .get(checkAccessToken, allowRole(UserRole.Admin), handleGetFlatBookingById)
  .delete(checkAccessToken, allowRole(UserRole.Admin), handleDeleteFlatBooking);

// ADMIN: Update booking status
router
  .route('/admin/flat/bookings/:id/status')
  .patch(checkAccessToken, allowRole(UserRole.Admin), handleUpdateFlatBookingStatus);

// ADMIN: Booking stats (group by status)
router
  .route('/admin/flat/bookings/stats')
  .get(checkAccessToken, allowRole(UserRole.Admin), handleFlatBookingStats);

// ADMIN: Available flats list + count
router
  .route('/admin/flat/available')
  .get(checkAccessToken, allowRole(UserRole.Admin), handleAvailableFlatStats);

// ADMIN: Sold-out flats list + count
router
  .route('/admin/flat/soldout')
  .get(checkAccessToken, allowRole(UserRole.Admin), handleSoldOutFlatStats);

export default router;
