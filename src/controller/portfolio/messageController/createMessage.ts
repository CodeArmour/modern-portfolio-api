/**
 * Node modules
 */
import sanitizeHtml from 'sanitize-html';

/**
 * Custom modules import
 */
import { logger } from "@/lib/winston";

/**
 * Models import
 */
import { Message } from "@/models/portfolio_message";

/**
 * Types import
 */
import type { Request, Response } from "express";
import type { IMessage } from "@/models/portfolio_message";

type MessageData = Pick<IMessage, "name" | "email" | "message">;

const createMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, message } = req.body as MessageData;

    // Sanitize the message content to prevent XSS attacks
    const cleanMessage = sanitizeHtml(message, {
      allowedTags: [], // Strip all HTML tags
      allowedAttributes: {}, // Strip all attributes
    });

    // Get IP address and user agent for spam prevention
    const ipAddress = req.ip || req.socket.remoteAddress;
    const userAgent = req.get('user-agent');

    const newMessage = await Message.create({
      name,
      email,
      message: cleanMessage,
      ipAddress,
      userAgent,
      isRead: false,
      isReplied: false,
    });

    logger.info("New message received", { 
      name: newMessage.name, 
      email: newMessage.email,
      id: newMessage._id 
    });

    res.status(201).json({
      message: "Message sent successfully! I'll get back to you soon.",
    });
  } catch (error) {
    res.status(500).json({
      code: "ServerError",
      message: "Failed to send message. Please try again later.",
      error: error,
    });
    logger.error("Error while creating message", error);
  }
};

export default createMessage;