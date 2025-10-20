/**
 * Custom Modules
 */
import { logger } from "@/lib/winston";
//import Link from "@/models/link";

/**
 * Models
 */
import User from '@/models/user';

/**
 * Types
 */
import { Request, Response } from 'express';

const deleteCurrentUser = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    try {
        // Delete links associated with current user
        //await Link.deleteMany({ creator: userId });

        // Delete the current logged-in user by userId
        await User.deleteOne({ _id: userId });
        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({
            code: "ServerError",
            message: "Internal server error",
        });
        logger.error(`Error deleting current user: ${error}`);
    }
}

export default deleteCurrentUser;