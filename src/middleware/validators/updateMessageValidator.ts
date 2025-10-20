/**
 * Node modules
 */
import { body, param } from "express-validator";

/**
 * Custom modules
 */
import validationError from "@/middleware/validationError";

const updateMessageValidator = [
  param("id")
    .notEmpty()
    .withMessage("Message ID is required")
    .isMongoId()
    .withMessage("Invalid message ID"),

  body("isRead")
    .optional()
    .isBoolean()
    .withMessage("isRead must be a boolean value"),

  body("isReplied")
    .optional()
    .isBoolean()
    .withMessage("isReplied must be a boolean value"),

  validationError,
];

export default updateMessageValidator;