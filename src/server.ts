/**
 * @copyright 2025 omarcode
 * @license Apach-2.0
 */

/**
 * Module alias registration (must be first)
 */
import 'module-alias/register';
import cors from 'cors';

// Debug: Check all environment variables
console.log('=== ENVIRONMENT VARIABLES CHECK ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('MONGO_CONNECTION_URI exists:', !!process.env.MONGO_CONNECTION_URI);
console.log('LOGTAIL_SOURCE_TOKEN exists:', !!process.env.LOGTAIL_SOURCE_TOKEN);
console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('JWT_ACCESS_SECRET exists:', !!process.env.JWT_ACCESS_SECRET);
console.log('Total env vars:', Object.keys(process.env).length);
console.log('===================================');

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

console.log('=== Server Starting ===');
console.log('NODE_ENV:', config.NODE_ENV);
console.log('PORT:', config.PORT);

/**
 * Initial express
 */
const server = express();

const allowedOrigins = [
  'http://localhost:3000',                 // for local Next.js dev
  'https://modern-portfolio-red-alpha.vercel.app', // replace with your deployed frontend
];

server.use(
  cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

/**
 * Secure headers
 */
server.use(helmet());

/**
 * Parse JSON request bodies
 */
server.use(express.json());

/**
 * Parse URL encoded-bodies
 */
server.use(express.urlencoded({ extended: true }));

/**
 * Set the public folder
 */
server.use(express.static(`${__dirname}/public`));

/**
 * Cookie parser
 */
server.use(cookieParser());

/**
 * Compress response
 */
server.use(compression());

console.log('Express middleware configured');

// Immediately Invoked Async Function to initialize the application
(async function (): Promise<void> {
    try {
        console.log('Attempting to connect to MongoDB...');
        
        // Establish a connection to the MongoDB database
        await connectDB();
        
        console.log('MongoDB connected successfully');

        // Register application routes under the root path
        server.use('/api/v1', router);
        
        console.log('Routes registered');

        // Start the server and listen on the configured port
        const PORT = config.PORT || 3030;
        server.listen(PORT, () => {
            console.log(`✓ Server listening at http://localhost:${PORT}`);
            logger.info(`Server listening at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        logger.error('Failed to start server', error);

        if (config.NODE_ENV === 'production') {
            process.exit(1);
        }
    }
})();

// Handle graceful server shutdown on termination signals (e.g., SIGTERM, SIGINT)
const serverTermination = async (signal: NodeJS.Signals): Promise<void> => {
    try {
        console.log(`Received ${signal}, shutting down gracefully...`);
        
        // Disconnect from the MongoDB database
        await disconnectDB();
        
        // Log a warning indicating the server is shutting down
        logger.info('Server shutdown', signal);

        // Flush any remaining logs to Logtail before exiting (if available)
        if (logtail) {
            await logtail.flush();
        }

        console.log('Shutdown complete');
        
        // Exit the process cleanly
        process.exit(0);
    } catch (error) {
        // Log any errors that occur during the shutdown process
        console.error('Error during server shutdown:', error);
        logger.error('Error during server shutdown', error);
        process.exit(1);
    }
}

// Listen for termination signals and trigger graceful shutdown
process.on('SIGTERM', serverTermination);
process.on('SIGINT', serverTermination);