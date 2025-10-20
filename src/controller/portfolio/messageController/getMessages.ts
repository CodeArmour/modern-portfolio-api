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

const getMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    // Optional query parameters for filtering
    const { isRead, isReplied, limit = 50, page = 1 } = req.query;

    // Build filter object
    const filter: any = {};
    
    if (isRead !== undefined) {
      filter.isRead = isRead === 'true';
    }
    
    if (isReplied !== undefined) {
      filter.isReplied = isReplied === 'true';
    }

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Get messages with pagination
    const messages = await Message.find(filter)
      .sort({ createdAt: -1 }) // Newest first
      .limit(Number(limit))
      .skip(skip)
      .lean()
      .exec();

    // Get total count for pagination
    const totalMessages = await Message.countDocuments(filter);
    const totalPages = Math.ceil(totalMessages / Number(limit));

    if (!messages || messages.length === 0) {
      res.status(404).json({
        code: "MessagesNotFound",
        message: "No messages found",
      });
      logger.warn("No messages found");
      return;
    }

    logger.info(`Retrieved ${messages.length} messages successfully`);

    res.status(200).json({
      messages: messages,
      pagination: {
        total: totalMessages,
        page: Number(page),
        limit: Number(limit),
        totalPages: totalPages,
      },
    });
  } catch (error) {
    res.status(500).json({
      code: "ServerError",
      message: "Internal server error",
      error: error,
    });
    logger.error("Error while retrieving messages", error);
  }
};

export default getMessages;