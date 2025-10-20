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

const deleteMultipleMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ids } = req.body as { ids: string[] };

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      res.status(400).json({
        code: "InvalidRequest",
        message: "An array of project IDs is required",
      });
      return;
    }

    // Fetch projects to clean up Cloudinary images
    const messages = await Message.find({ _id: { $in: ids } });

    if (messages.length === 0) {
      res.status(404).json({
        code: "MessagesNotFound",
        message: "No Messages found for the provided IDs",
      });
      return;
    }

    // Delete projects from DB
    const result = await Message.deleteMany({ _id: { $in: ids } });

    logger.info(`Deleted ${result.deletedCount} messages`);

    res.status(200).json({
      message: "Messages deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({
      code: "ServerError",
      message: "Internal server error",
      error,
    });
    logger.error("Error while deleting multiple Messages", error);
  }
};

export default deleteMultipleMessages;
