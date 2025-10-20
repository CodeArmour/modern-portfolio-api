/**
 * Node Modules
 */
import { Router } from "express";

/**
 * Custom Modules
 */
import expressRateLimit from "@/lib/expressRateLimit";

/**
 * Controllers
 */
import createMessage from "@/controller/portfolio/messageController/createMessage";
import getMessage from "@/controller/portfolio/messageController/getMessageById";
import getMessages from "@/controller/portfolio/messageController/getMessages";
import updateMessage from "@/controller/portfolio/messageController/updateMessage";
import deleteMessage from "@/controller/portfolio/messageController/deleteMessage";
import deleteMultipleMessages from "@/controller/portfolio/messageController/deleteMultiMessages";

/**
 * Middlewares
 */
import authentication from "@/middleware/authentication";
import authorization from "@/middleware/authorization";

/**
 * Validator
 */
import createMessageValidator from "@/middleware/validators/createMessageValidator";
import getMessageValidator from "@/middleware/validators/getMessageValidator";
import updateMessageValidator from "@/middleware/validators/updateMessageValidator";
import deleteMessageValidator from "@/middleware/validators/deleteMessageValidator";
/**
 * Initial express router
 */
const router = Router();

// Public route - Create message (NO authentication needed)
router.post(
    '/create',
    expressRateLimit('basic'), // Rate limit to prevent spam
    createMessageValidator,
    createMessage
);

router.get(
    '/',
    expressRateLimit('basic'),
    authentication,
    authorization(['admin']),
    getMessages
);

router.get(
    '/:id',
    expressRateLimit('basic'),
    authentication,
    authorization(['admin']),
    getMessageValidator,
    getMessage
);

router.patch(
    '/:id',
    expressRateLimit('basic'),
    authentication,
    authorization(['admin']),
    updateMessageValidator,
    updateMessage
);

router.delete(
    '/:id',
    expressRateLimit('basic'),
    authentication,
    authorization(['admin']),
    deleteMessageValidator,
    deleteMessage
);

router.delete(
  "/delete-multiple",
  expressRateLimit("basic"),
  authentication,
  authorization(["admin"]),
  deleteMultipleMessages
);




export default router;