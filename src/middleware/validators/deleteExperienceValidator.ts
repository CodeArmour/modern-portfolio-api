/**
 * Node modules
 */
import { param } from "express-validator";

/**
 * Custom modules
 */
import validationError from "@/middleware/validationError";

const deleteExperienceValidator = [
  param("id")
    .notEmpty()
    .withMessage("Experience ID is required")
    .isMongoId()
    .withMessage("Invalid experience ID"),

  validationError,
];

export default deleteExperienceValidator;