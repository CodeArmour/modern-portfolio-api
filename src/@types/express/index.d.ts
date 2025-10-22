/**
 * Types
 */
import { Types } from "mongoose";

declare global {
    namespace Express {
        interface Request {
            user?: {
                id?: Types.ObjectId;
                role?: "user" | "admin";
            }
        }
    }
}

// This export is needed to make this a module
export {};