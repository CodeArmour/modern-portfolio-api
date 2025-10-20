/**
 * Node Modules
 */
import { Router } from "express";

/**
 * Custom Modules
 */
import expressRateLimit from "@/lib/expressRateLimit";
import { upload } from "@/middleware/upload";

/**
 * Controllers
 */
import createProject from "@/controller/portfolio/projectController/createProject";
import getProjects from "@/controller/portfolio/projectController/getProjects";
import getProject from "@/controller/portfolio/projectController/getProjectById";
import updateProject from "@/controller/portfolio/projectController/updateProject";
import deleteProject from "@/controller/portfolio/projectController/deleteProject";
import deleteMultipleProjects from "@/controller/portfolio/projectController/deleteMuliProjects";

/**
 * Middlewares
 */
import authentication from "@/middleware/authentication";
import authorization from "@/middleware/authorization";

/**
 * Validators
 */
import createProjectValidator from "@/middleware/validators/createProjectValidator";
import getProjectValidator from "@/middleware/validators/getProjectValidator";
import updateProjectValidator from "@/middleware/validators/updateProfileValidator";

/**
 * Initial express router
 */
const router = Router();

// Protected route - Create project with image upload (Admin only)
router.post(
    '/create',
    expressRateLimit('basic'),
    authentication,
    authorization(['admin']),
    upload.single('image'), // 'image' is the field name
    createProjectValidator,
    createProject
);

router.get(
    '/public',
    expressRateLimit('basic'),
    getProjects
);

router.get(
    '/admin',
    expressRateLimit('basic'),
    authentication,
    authorization(['admin']),
    getProjects
);

router.get(
    '/:id',
    expressRateLimit('basic'),
    getProjectValidator,
    getProject
);

router.patch(
  "/:id",
  expressRateLimit("basic"),
  authentication,
  authorization(["admin"]),
  upload.single("image"), // optional new image
  updateProjectValidator,
  updateProject
);

router.delete(
  "/:id",
  expressRateLimit("basic"),
  authentication,
  authorization(["admin"]),
  deleteProject
);

router.delete(
  "/delete-multiple",
  expressRateLimit("basic"),
  authentication,
  authorization(["admin"]),
  deleteMultipleProjects
);



export default router;