

import { Router } from "express";

import UserMiddlewares from "../../modules/user/user.middlewares";
import { UserRole } from '../../interfaces/jwtPayload.interfaces';
import BlockedDateController from "../../modules/blockedDate/blockedDate.controller";

const { checkAccessToken, allowRole } = UserMiddlewares;

const router = Router();

 
router.route('/host/blockedate-create').post(checkAccessToken,allowRole(UserRole.Host),BlockedDateController.handleCreateBlockedDate);
router.route('/blockdate/rent/:rentId').get(BlockedDateController.handleGetBlockedDatesByRent) 

export default router;