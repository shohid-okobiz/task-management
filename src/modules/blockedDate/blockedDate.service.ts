import { IBlockedDate } from './blockedDate.interface';
import { BlockedDateRepo } from './blockedDate.repositories';

const BlockedDateService = {
    createBlockedDate: async (data: IBlockedDate): Promise<IBlockedDate> => {
        try {
            return await BlockedDateRepo.create(data);
        } catch (error) {
            throw error instanceof Error
                ? error
                : new Error('Unknown error occurred in createBlockedDate service.');
        }
    },

    getBlockedDatesByRent: async (rentId: string): Promise<IBlockedDate[]> => {
        try {
            return await BlockedDateRepo.findByRent(rentId);
        } catch (error) {
            throw error instanceof Error
                ? error
                : new Error('Unknown error occurred in getBlockedDatesByRent service.');
        }
    },
};

export default BlockedDateService;
