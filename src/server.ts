/**
 * @copyright 2025 omarcode
 * @license Apach-2.0
 */

/**
 * Node modules
 */
import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import compression from 'compression';

/**
 * Custom modules
 */
import config from '@/config';
import { logger, logtail } from '@/lib/winston';
import { connectDB, disconnectDB } from './lib/mongoose';

/**
 * Routes
 */
import router from './routes/v1';

/**
 * Initial express
 */
const server = express();


/**
 * Secure  headers
 */
server.use(helmet());

/**
 * Parse JSON request bodies
 */
server.use(express.json());

/**
 * Parse URL encoded-bodie
 */
server.use(express.urlencoded({ extended: true }));

/**
 * Set the public folder
 */
server.use(express.static(`{__dirname}/public`));

/**
 * Cookie parser
 */
server.use(cookieParser());

/**
 * Compress response
 */
server.use(compression());

// Immediately Invoked Async Function to initialize the application
(async function (): Promise<void> {
    try {
        // Establish a connection to the MongoDB database
        await connectDB();

        // Register application routes under the root path
        server.use('/api/v1', router);
        // Start the server and listen on the configured port
        server.listen(config.PORT, () => {
            logger.info(`Server listening at http://localhost:${config.PORT}`);
        })
    } catch (error) {
        logger.error('Faild to start server', error);

        if (config.NODE_ENV === 'produuction') {
            process.exit(1);
        }
    }
})();

// Handle graceful server shoutdown on termination signals (e.g., SIGTERM, SIGINT)
const serverTermination = async (signal: NodeJS.Signals): Promise<void> => {
    try {
        // Disconnect from the MongoDB database
        await disconnectDB();
        // Log a warning indicating the server is shutting down
        logger.info('Server shutdown', signal);

        // Flush any remaining logs to Logtail before exiting
        logtail.flush();

        // Exit the process cleanly
        process.exit(0);
    } catch (error) {
        //Log any errors that occur during the shutdown process
        logger.error('Error during server shutdown', error);
    }
}

// Listen for termination signals and trigger graceful shutdown
process.on('SIGTERM', serverTermination);
process.on('SIGINT', serverTermination);