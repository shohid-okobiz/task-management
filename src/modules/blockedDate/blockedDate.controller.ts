import { Request, Response, NextFunction } from 'express';

import logger from '../../configs/logger.configs';
import BlockedDateService from './blockedDate.service';

const BlockedDateController = {
    handleCreateBlockedDate: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = req.body;
            const blockedDate = await BlockedDateService.createBlockedDate(data);
            res.status(201).json({
                status: 'success',
                message: 'Date blocked successfully',
                data: blockedDate,
            });
        } catch (error) {
            const err = error as Error;
            logger.error(err.message);
            next(err);
        }
    },

    handleGetBlockedDatesByRent: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const rentId = req.params.rentId;
            const dates = await BlockedDateService.getBlockedDatesByRent(rentId);
            res.status(200).json({
                status: 'success',
                message: 'Blocked dates fetched successfully',
                data: dates,
            });
        } catch (error) {
            const err = error as Error;
            logger.error(err.message);
            next(err);
        }
    },
};

export default BlockedDateController;
