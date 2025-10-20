/**
 * Node modules
 */
import { param } from "express-validator";

/**
 * Custom modules
 */
import validationError from "@/middleware/validationError";

const deleteMessageValidator = [
  param("id")
    .notEmpty()
    .withMessage("Message ID is required")
    .isMongoId()
    .withMessage("Invalid Message ID"),

  validationError,
];

export default deleteMessageValidator;