/**
 * @copyright 2025 omarcode
 * @license Apach-2.0
 */

/**
 * Node Modules
 */
import mongoose from "mongoose";

/**
 * Custom Modules
 */
import config from "@/config";
import { logger } from "./winston";

/**
 * Types
 */
import type { ConnectOptions } from "mongoose";

/**
 * Mongo connection options
 */
const connectionOption: ConnectOptions = {
    serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true,
    },
    dbName: 'shorty-api',
};

export const connectDB = async (): Promise<void> => {
    if (!config.MONGO_CONNECTION_URI) {
        throw new Error('MONGO_URI is not defined in environment variables');
    }

    try {
        await mongoose.connect(config.MONGO_CONNECTION_URI, connectionOption);
        logger.info('MongoDB connected successfully', {
            uri: config.MONGO_CONNECTION_URI, options: connectionOption
        });
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }

        logger.error('Error connecting to MongoDB:', error);
    }
};


export const disconnectDB = async (): Promise<void> => {
    try {
        await mongoose.disconnect();
        logger.warn('MongoDB disconnected successfully', 
            { uri: config.MONGO_CONNECTION_URI, options: connectionOption }
        );
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error disconnecting from MongoDB: ${error.message}`);
        }

        logger.error('Error disconnecting from MongoDB:', error);
    }
}