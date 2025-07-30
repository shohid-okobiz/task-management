import { Router } from 'express';
import RentBookingController from '../../modules/rentbooking/rentbooking.controllers';
import UserMiddlewares from '../../modules/user/user.middlewares';
import { UserRole } from '../../interfaces/jwtPayload.interfaces';

const router = Router();
const {
  handleCreateRentBooking,
  handleGetAllRentBookings,
  handleGetRentBookingById,
  handleGetRentByAllBooking,
  handleGetGuestBooking,
  handleUpdateRentBookingStatus,
  handleDeleteRentBooking,
  handleRentBookingHostEarning,
  handleAvailableRentStats,
  handlePaymentSuccess,
  handlePaymentFail,
  handlePaymentCancel,
  handlePaymentIPN
  // handleSoldOutRentStats,
} = RentBookingController;

const { checkAccessToken, allowRole } = UserMiddlewares;

// USER: Create booking
router
  .route('/booking/rent')
  .post(checkAccessToken, handleCreateRentBooking)
  .get(checkAccessToken, handleGetAllRentBookings);

router
  .route('/payment/success')
  .post(handlePaymentSuccess);

router
  .route('/payment/fail')
  .post(handlePaymentFail);

router
  .route('/payment/cancel')
  .post(handlePaymentCancel);

router
  .route('/payment/ipn')
  .post(handlePaymentIPN);

router
  .route('/rent/bookings/:id')
  .get(checkAccessToken, handleGetRentBookingById)

router
  .route('/rent/:id/bookings')
  .get(handleGetRentByAllBooking)
router
  .route('/guest/rent/bookings')
  .get(checkAccessToken, handleGetGuestBooking)

// ADMIN: Get single booking / Delete booking
router
  .route('/admin/rent/bookings/:id')
  .get(checkAccessToken, allowRole(UserRole.Admin), handleGetRentBookingById)
  .delete(checkAccessToken, allowRole(UserRole.Admin), handleDeleteRentBooking);

// ADMIN: Update booking status
router
  .route('/admin/rent/bookings/:id/status')
  .patch(checkAccessToken, allowRole(UserRole.Admin), handleUpdateRentBookingStatus);

// HOST: Booking stats (group by status)
router
  .route('/host/rent/bookings/earnings')
  .get(checkAccessToken, handleRentBookingHostEarning);

// // ADMIN: Available rents list + count
// router
//   .route('/admin/rent/available')
//   .get(checkAccessToken, allowRole(UserRole.Admin), handleAvailableRentStats);

// ADMIN: Sold-out rents list + count
// router
//   .route('/admin/rent/soldout')
//   .get(checkAccessToken, allowRole(UserRole.Admin), handleSoldOutRentStats);

export default router;
