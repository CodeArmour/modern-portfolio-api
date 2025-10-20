/**
 * Node modules
 */
import { body } from "express-validator";

/**
 * Custom modules
 */
import validationError from "@/middleware/validationError";

const createMessageValidator = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be a valid email address")
    .normalizeEmail(),

  body("message")
    .notEmpty()
    .withMessage("Message is required")
    .trim()
    .isLength({ min: 10, max: 5000 })
    .withMessage("Message must be between 10 and 5000 characters"),

  validationError,
];

export default createMessageValidator;