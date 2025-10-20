/**
 * @copyright 2025 omarcode
 * @license Apach-2.0
 */

/**
 * Node Modules
 */
import  config  from '@/config';
import { rateLimit } from 'express-rate-limit';

/**
 * Types
 */
import type { RateLimitRequestHandler, Options } from 'express-rate-limit';
type RateLimitType = 'basic' | 'auth' | 'passReset';

// Default rate limit configuration applied for all types
const defaultLimitOpt: Partial<Options> = {
    windowMs: config.WINDOW_MS,
    legacyHeaders: false,
    standardHeaders: true,
};

const rateLimitOpt = new Map<RateLimitType, Partial<Options>>([
    ['basic', { ...defaultLimitOpt, limit: 100 }], //100 requests per window for basic type
    ['auth', { ...defaultLimitOpt, limit: 10 }], //10 requests per window for auth type
    ['passReset', { ...defaultLimitOpt, limit: 3 }], //3 request per window for password reset
]);

// Function to get rate limit middleware based on type
const expressRateLimit = (type: RateLimitType): RateLimitRequestHandler => {
    return rateLimit(rateLimitOpt.get(type)); // Retrieve config from map and return middleware
};

export default expressRateLimit;