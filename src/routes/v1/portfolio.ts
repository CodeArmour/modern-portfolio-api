/**
 * Node Modules
 */
import { Router } from "express";

/**
 * Custom Modules
 */
import expressRateLimit from "@/lib/expressRateLimit";

/**
 * Controllers
 */
import createProfile from "@/controller/portfolio/profileController/createProfile";
import getProfile from "@/controller/portfolio/profileController/getPortfolio";
import updateProfile from "@/controller/portfolio/profileController/updateProfile";
import deleteProfile from "@/controller/portfolio/profileController/deleteProfile";

import createExperience from "@/controller/portfolio/experienceController/createExperience";

/**
 * Middlewares
 */
import authentication from "@/middleware/authentication";
import authorization from "@/middleware/authorization";

/**
 * Validators
 */
import  createProfileValidator  from "@/middleware/validators/createProfileValidator";
import  updateProfileValidator  from "@/middleware/validators/updateProfileValidator";


/**
 * Initial express router
 */
const router = Router();

// Profile Portfolio Routes
router.post(
    '/create',
    expressRateLimit('basic'),
    authentication,
    authorization(['admin']),
    createProfileValidator,
    createProfile
);

router.get(
    '/:userId',
    expressRateLimit('basic'),
    getProfile
);

router.get(
    '/',
    expressRateLimit('basic'),
    getProfile
);

router.patch(
    '/update',
    expressRateLimit('basic'),
    authentication,
    authorization(['admin']),
    updateProfileValidator,
    updateProfile
);

router.delete(
    '/delete',
    expressRateLimit('basic'),
    authentication,
    authorization(['admin']),
    deleteProfile
);

export default router;