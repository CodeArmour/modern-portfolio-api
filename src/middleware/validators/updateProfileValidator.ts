/**
 * Node modules
 */
import { body } from "express-validator";

/**
 * Custom modules
 */
import  validationError  from "@/middleware/validationError";

const updateProfileValidator = [
  body("workAvailability")
    .optional()
    .isBoolean()
    .withMessage("Work availability must be a boolean value"),

  body("workTitle")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Work title cannot be empty")
    .isLength({ max: 100 })
    .withMessage("Work title must be less than 100 characters"),

  body("aboutMe")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("About me cannot be empty")
    .isLength({ max: 500 })
    .withMessage("About me must be less than 500 characters"),

  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Description cannot be empty")
    .isLength({ max: 1000 })
    .withMessage("Description must be less than 1000 characters"),

  body("email")
    .optional()
    .isEmail()
    .withMessage("Email must be a valid email address")
    .normalizeEmail(),

  body("phone")
    .optional()
    .trim()
    .isMobilePhone("any")
    .withMessage("Phone must be a valid phone number"),

  body("location")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Location must be less than 100 characters"),

  body("socialLinks")
    .optional()
    .isObject()
    .withMessage("Social links must be an object"),

  body("socialLinks.github")
    .optional()
    .trim()
    .isURL()
    .withMessage("GitHub must be a valid URL"),

  body("socialLinks.linkedin")
    .optional()
    .trim()
    .isURL()
    .withMessage("LinkedIn must be a valid URL"),

  body("socialLinks.x")
    .optional()
    .trim()
    .isURL()
    .withMessage("X (Twitter) must be a valid URL"),

  body("socialLinks.website")
    .optional()
    .trim()
    .isURL()
    .withMessage("Website must be a valid URL"),

  body("resumeUrl")
    .optional()
    .trim()
    .isURL()
    .withMessage("Resume URL must be a valid URL"),

  body("published")
    .optional()
    .isBoolean()
    .withMessage("Published must be a boolean value"),

  validationError,
];

export default updateProfileValidator;