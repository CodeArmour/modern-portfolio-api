/**
 * Node Modules
 */
import mongoose from "mongoose";

/**
 * Custom Modules
 */
import config from "@/config";

/**
 * Generate custom mongoose id
 */
export const generateMongooseId = () => new mongoose.Types.ObjectId();
