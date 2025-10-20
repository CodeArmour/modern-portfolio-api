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

type UpdateMessageData = Partial<
  Pick<IMessage, "isRead" | "isReplied">
>;

const updateMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body as UpdateMessageData;

    // Find the message
    const message = await Message.findById(id);

    if (!message) {
      res.status(404).json({
        code: "MessageNotFound",
        message: "Message not found",
      });
      logger.warn(`Message not found with id: ${id}`);
      return;
    }

    // If marking as replied, set the repliedAt timestamp
    if (updateData.isReplied === true && !message.isReplied) {
      message.repliedAt = new Date();
    }

    // If unmarking as replied, clear the repliedAt timestamp
    if (updateData.isReplied === false) {
      message.repliedAt = undefined;
    }

    // Update the message with new data
    Object.assign(message, updateData);
    await message.save();

    logger.info("Message updated successfully", { id });

    res.status(200).json({
      message: "Message updated successfully",
      data: message,
    });
  } catch (error) {
    res.status(500).json({
      code: "ServerError",
      message: "Internal server error",
      error: error,
    });
    logger.error("Error while updating message", error);
  }
};

export default updateMessage;