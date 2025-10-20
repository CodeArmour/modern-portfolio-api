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

const getMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const message = await Message.findById(id).lean().exec();

    if (!message) {
      res.status(404).json({
        code: "MessageNotFound",
        message: "Message not found",
      });
      logger.warn(`Message not found with id: ${id}`);
      return;
    }

    logger.info("Message retrieved successfully", { id });

    res.status(200).json({
      message: message,
    });
  } catch (error) {
    res.status(500).json({
      code: "ServerError",
      message: "Internal server error",
      error: error,
    });
    logger.error("Error while retrieving message", error);
  }
};

export default getMessage;