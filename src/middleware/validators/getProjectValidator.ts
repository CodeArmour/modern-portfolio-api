/**
 * Node modules
 */
import { param } from "express-validator";

/**
 * Custom modules
 */
import validationError from "@/middleware/validationError";

const getProjectValidator = [
  param("id")
    .notEmpty()
    .withMessage("Project ID is required")
    .isMongoId()
    .withMessage("Invalid project ID"),

  validationError,
];

export default getProjectValidator