/**
 * Node modules
 */
import { body } from "express-validator";

/**
 * Custom modules
 */
import validationError from "@/middleware/validationError";

const createExperienceValidator = [
  body("company")
    .notEmpty()
    .withMessage("Company name is required")
    .trim()
    .isLength({ max: 100 })
    .withMessage("Company name must be less than 100 characters"),

  body("position")
    .notEmpty()
    .withMessage("Position is required")
    .trim()
    .isLength({ max: 100 })
    .withMessage("Position must be less than 100 characters"),

  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Description must be less than 2000 characters"),

  body("location")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Location must be less than 100 characters"),

  body("employmentType")
    .optional()
    .trim()
    .isIn(["Full-time", "Part-time", "Contract", "Freelance", "Internship"])
    .withMessage(
      "Employment type must be one of: Full-time, Part-time, Contract, Freelance, Internship"
    ),

  body("startDate")
    .notEmpty()
    .withMessage("Start date is required")
    .isISO8601()
    .withMessage("Start date must be a valid date"),

  body("endDate")
    .optional()
    .isISO8601()
    .withMessage("End date must be a valid date")
    .bail()
    .custom((endDate, { req }) => {
      if (endDate && req.body.startDate) {
        const start = new Date(req.body.startDate);
        const end = new Date(endDate);
        if (end < start) {
          throw new Error("End date must be after start date");
        }
      }
      return true;
    }),

  body("isCurrent")
    .optional()
    .isBoolean()
    .withMessage("isCurrent must be a boolean value"),

  body("technologies")
    .optional()
    .isArray()
    .withMessage("Technologies must be an array")
    .bail()
    .custom((technologies) => {
      if (technologies.length > 20) {
        throw new Error("Maximum 20 technologies allowed");
      }
      return true;
    }),

  body("technologies.*")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Each technology must be less than 50 characters"),

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


export default createExperienceValidator;