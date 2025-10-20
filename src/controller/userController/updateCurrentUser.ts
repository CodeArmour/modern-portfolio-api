/**
 * Custom Modules
 */
import { logger } from "@/lib/winston";
import bcrypt from "bcrypt";

/**
 * Models
 */
import User from '@/models/user';

/**
 * Types
 */
import { Request, Response } from 'express';

const updateCurrentUser = async (req: Request, res: Response): Promise<void> => {
    // Extract the logged userId from the request object
    const userId = req.user?.id;
    const dataToUpdate = req.body;

    try {
       
       // If newPassword is provided, hash it before updating
       if (dataToUpdate.new_password) {
           dataToUpdate.password = await bcrypt.hash(dataToUpdate.new_password, 10);
       }
       
       
       // Update the current user data
       const result = await User.updateOne({ _id: userId }, dataToUpdate);
       console.log('Update result:', result); // Debug log
       
       res.sendStatus(204);

    } catch (error) {
        res.status(500).json({
            code: "ServerError",
            message: "Internal server error",
        });
        logger.error('error in updateCurrentUser:', error);
    }
};

export default updateCurrentUser;