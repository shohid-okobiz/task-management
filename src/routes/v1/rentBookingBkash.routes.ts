import { Router } from 'express';
import RentBookingBkashController from '../../modules/rentbooking/rentbooking.bkash.controllers';
const {
    handleBkashCallback
} = RentBookingBkashController

const router = Router();


router
    .route('/bkash/payment-callback')
    .post(handleBkashCallback)
    .get(handleBkashCallback)

export default router;
