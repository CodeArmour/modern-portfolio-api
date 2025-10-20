/**
 * Node Modules
 */
import { Router } from "express";
import bcrypt from "bcrypt";

/**
 * Custom Modules
 */
import expressRateLimit from "@/lib/expressRateLimit";
/**
 * Controllers
 */
import getCurrentUser from "@/controller/userController/getCurrentUser";
import deleteCurrentUser from "@/controller/userController/deleteCurrentUser";
import updateCurrentUser from "@/controller/userController/updateCurrentUser";

/**
 * Middlewares
 */
import authentication from "@/middleware/authentication";
import authorization from "@/middleware/authorization";
import validationError from "@/middleware/validationError";
import { body } from "express-validator";

/**
 * Models
 */
import User from "@/models/user";

/**
 * Initial express router
 */
const router = Router();

router.get(
  "/current",
  expressRateLimit("basic"),
  authentication,
  authorization(["user", "admin"]),
  getCurrentUser
);
router.delete(
  "/current",
  expressRateLimit("basic"),
  authentication,
  authorization(["user", "admin"]),
  deleteCurrentUser
);
router.patch(
  "/current",
  expressRateLimit("basic"),
  authentication,
  authorization(["user", "admin"]),
  body("name").optional().trim().notEmpty().withMessage("Name cannot be empty"),

  body("email")
    .optional()
    .isEmail()
    .withMessage("Email must be a valid email address")
    .normalizeEmail()
    .bail()
    .custom(async (email, { req }) => {
      const userId = req.userId;

      const currentUser = await User.findById(userId)
        .select("email")
        .lean()
        .exec();
      if (currentUser && currentUser.email === email) {
        return true;
      }

      const isDuplicate = await User.exists({ email });
      if (isDuplicate) {
        throw new Error("Email already in use");
      }
      return true;
    }),

  body("current_password")
    .if(body("new_password").exists())
    .notEmpty()
    .withMessage("Current password is required when changing password")
    .bail()
    .custom(async (currentPassword, { req }) => {
      const userId = req.userId;
      const user = await User.findById(userId).select("password").lean().exec();

      if (!user) {
        throw new Error("User not found");
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        throw new Error("Current password is incorrect");
      }
      return true;
    }),

  body("new_password")
    .if(body("current_password").exists())
    .notEmpty()
    .withMessage("New password is required when current password is provided")
    .isLength({ min: 8 })
    .withMessage("New password must be at least 8 characters long"),

  body("role")
    .optional()
    .custom(() => {
      throw new Error("Role cannot be changed");
    }),

  validationError,
  updateCurrentUser
);

export default router;
