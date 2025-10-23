/**
 * Node Modules
 */
import { createLogger, format, transports, transport } from "winston";
import { Logtail } from "@logtail/node";
import { LogtailTransport } from "@logtail/winston";

/**
 * Custom modules
 */
import config from '@/config';

// Initialize an array to hold all configured Winston transports
const transportation: transport[] = [];

// Make Logtail optional - only use if credentials are provided
let logtail: Logtail | null = null;

if (config.LOGTAIL_SOURCE_TOKEN && config.LOGTAIL_INGESTING_HOST) {
    try {
        // Create a Logtail instance for sending structured logs to remote logging service
        logtail = new Logtail(config.LOGTAIL_SOURCE_TOKEN, {
            endpoint: config.LOGTAIL_INGESTING_HOST.startsWith('http') 
                ? config.LOGTAIL_INGESTING_HOST 
                : `https://${config.LOGTAIL_INGESTING_HOST}`
        });

        // In production environment, push LogtailTransport to winston transport
        if (config.NODE_ENV === 'production') {
            transportation.push(new LogtailTransport(logtail));
            console.log('✓ Logtail logging enabled');
        }
    } catch (error) {
        console.warn('⚠ Failed to initialize Logtail:', error);
        console.warn('Falling back to console logging');
    }
} else {
    console.warn('⚠ Logtail credentials missing - using console logging only');
}

// Destructure logging format utilities from winston
const { colorize, combine, timestamp, label, printf } = format;

// In development environment OR if no other transport is configured, use console logging
if (config.NODE_ENV === 'development' || transportation.length === 0) {
    transportation.push(
        new transports.Console({
            format: combine(
                colorize({ all: true }),
                label(),
                timestamp({ format: 'DD MMMM hh:mm:ss A' }),
                printf(({ level, message, timestamp }) => {
                    return `${timestamp} [${level}]: ${message}`;
                }),
            )
        }),
    );
}

// Create a winston logger with selected transports
const logger = createLogger({
    transports: transportation
});

// Export logtail as null if not initialized (for type safety)
export { logtail, logger };