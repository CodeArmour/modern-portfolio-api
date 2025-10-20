/**
 * Node modules
 */
import { body } from "express-validator";

/**
 * Custom modules
 */
import validationError from "@/middleware/validationError";
const createProjectValidator = [
  body("title")
    .notEmpty()
    .withMessage("Project title is required")
    .trim()
    .isLength({ max: 100 })
    .withMessage("Title must be less than 100 characters"),

  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .trim()
    .isLength({ max: 3000 })
    .withMessage("Description must be less than 3000 characters"),

  body("shortDescription")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Short description must be less than 200 characters"),

  body("projectUrl")
    .optional()
    .trim()
    .isURL()
    .withMessage("Project URL must be a valid URL"),

  body("githubUrl")
    .optional()
    .trim()
    .isURL()
    .withMessage("GitHub URL must be a valid URL"),

  body("technologies")
    .notEmpty()
    .withMessage("At least one technology is required")
    .custom((value) => {
      const technologies = typeof value === 'string' ? JSON.parse(value) : value;
      if (!Array.isArray(technologies) || technologies.length === 0) {
        throw new Error("Technologies must be a non-empty array");
      }
      if (technologies.length > 20) {
        throw new Error("Maximum 20 technologies allowed");
      }
      return true;
    }),

  body("category")
    .optional()
    .trim()
    .isIn([
      "Web Application",
      "Mobile Application",
      "Desktop Application",
      "UI/UX Design",
      "API/Backend",
      "Other",
    ])
    .withMessage("Invalid category"),

  body("startDate")
    .optional()
    .isISO8601()
    .withMessage("Start date must be a valid date"),

  body("endDate")
    .optional()
    .isISO8601()
    .withMessage("End date must be a valid date"),

  body("isFeatured")
    .optional()
    .isBoolean()
    .withMessage("isFeatured must be a boolean value"),

  body("order")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Order must be a positive integer"),

  body("published")
    .optional()
    .isBoolean()
    .withMessage("Published must be a boolean value"),

  validationError,
];

export default createProjectValidator