/**
 * Types
 */
import { Type } from "mongoose";

declare global {
    namespace Express {
        interface Request {
            user?:{
                id?: Type.ObjectId;
                role?: "user" | "admin";
            }
        }
    }
}