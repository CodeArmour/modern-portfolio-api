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
import createExperience from "@/controller/portfolio/experienceController/createExperience";
import getExperiences from "@/controller/portfolio/experienceController/getExperiences";
import updateExperience from "@/controller/portfolio/experienceController/updateExperience";
import deleteExperience from "@/controller/portfolio/experienceController/deleteExperience";

/**
 * Middlewares
 */
import authentication from "@/middleware/authentication";
import authorization from "@/middleware/authorization";

/**
 * Validators
 */
import  createExperienceValidator  from "@/middleware/validators/createExperienceValidator";
import  updateExperienceValidator  from "@/middleware/validators/updateExperienceValidator ";
import  deleteExperienceValidator  from "@/middleware/validators/deleteExperienceValidator";

/**
 * Initial express router
 */
const router = Router();


router.post(
    '/create',
    expressRateLimit('basic'),
    authentication,
    authorization(['admin']),
    createExperienceValidator,
    createExperience
);

router.get(
    '/:userId',
    expressRateLimit('basic'),
    getExperiences
);

router.get(
    '/',
    expressRateLimit('basic'),
    getExperiences
);

router.patch(
    '/:id',
    expressRateLimit('basic'),
    authentication,
    authorization(['admin']),
    updateExperienceValidator,
    updateExperience
);

router.delete(
    '/:id',
    expressRateLimit('basic'),
    authentication,
    authorization(['admin']),
    deleteExperienceValidator,
    deleteExperience
);


export default router;