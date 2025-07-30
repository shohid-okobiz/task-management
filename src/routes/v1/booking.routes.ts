import { Router } from "express";
import BookingRentControllers from '../../modules/bookingRent/booking.rent.controllers';
import UserMiddlewares from "../../modules/user/user.middlewares";
import { UserRole } from '../../interfaces/jwtPayload.interfaces';

const { checkAccessToken, allowRole } = UserMiddlewares;

const router = Router();

const {
    createBookingRent
} = BookingRentControllers;

router
    .route("/rent/booking")
    .post(
        // checkAccessToken,
        // allowRole(UserRole.Guest),
        createBookingRent
    )

export default router;
