/**
 * Node modules
 */
import { param } from "express-validator";

/**
 * Custom modules
 */
import validationError from "@/middleware/validationError";

const getMessageValidator = [
  param("id")
    .notEmpty()
    .withMessage("Message ID is required")
    .isMongoId()
    .withMessage("Invalid message ID"),

  validationError,
];

export default getMessageValidator;