/**
 * Node modules
 */
import { body } from "express-validator";

/**
 * Custom modules
 */
import  validationError  from "@/middleware/validationError";

/**
 * Models
 */
import { PortfolioProfile } from "@/models/portfolio_profile";

const createProfileValidator = [
  body("workAvailability")
    .notEmpty()
    .withMessage("Work availability is required")
    .isBoolean()
    .withMessage("Work availability must be a boolean value"),

  body("workTitle")
    .notEmpty()
    .withMessage("Work title is required")
    .trim()
    .isLength({ max: 100 })
    .withMessage("Work title must be less than 100 characters"),

  body("aboutMe")
    .notEmpty()
    .withMessage("About me is required")
    .trim()
    .isLength({ max: 500 })
    .withMessage("About me must be less than 500 characters"),

  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description must be less than 1000 characters"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be a valid email address")
    .normalizeEmail()
    .bail()
    .custom(async (email, { req }) => {
      const userId = req.userId;

      // Check if profile already exists for this user
      const existingProfile = await PortfolioProfile.findOne({ userId })
        .select("email")
        .lean()
        .exec();

      if (existingProfile) {
        throw new Error("Portfolio profile already exists for this user");
      }

      return true;
    }),

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

  validationError,
];

export default createProfileValidator;