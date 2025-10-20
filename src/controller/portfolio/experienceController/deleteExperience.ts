/**
 * Custom modules import
 */
import { logger } from "@/lib/winston";

/**
 * Models import
 */
import { Experience } from "@/models/portfolio_experience";

/**
 * Types import
 */
import type { Request, Response } from "express";

const deleteExperience = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    // Find and delete the experience
    const experience = await Experience.findByIdAndDelete(id);

    if (!experience) {
      res.status(404).json({
        code: "ExperienceNotFound",
        message: "Experience not found",
      });
      logger.warn(`Experience not found with id: ${id}`);
      return;
    }

    logger.info("Experience deleted successfully", { id });

    res.status(200).json({
      message: "Experience deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      code: "ServerError",
      message: "Internal server error",
      error: error,
    });
    logger.error("Error while deleting experience", error);
  }
};

export default deleteExperience;