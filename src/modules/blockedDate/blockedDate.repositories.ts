
import { IBlockedDate } from './blockedDate.interface';
import BlockedDate from './blockedDate.model';

const create = async (data: IBlockedDate): Promise<IBlockedDate> => {
    return await BlockedDate.create(data);
};

const findByRent = async (rentId: string): Promise<IBlockedDate[]> => {
    return await BlockedDate.find({ rent: rentId });
};

const hasOverlap = async (rentId: string, startDate: Date, endDate: Date): Promise<boolean> => {
    const overlapping = await BlockedDate.findOne({
        rent: rentId,
        $or: [
            {
                startDate: { $lte: endDate },
                endDate: { $gte: startDate },
            },
        ],
    });
    return !!overlapping;
};


export const BlockedDateRepo = {
    create,
    findByRent,
    hasOverlap,
};
