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

const getExperiences = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    let experiences;

    if (userId) {
      // Get experiences for a specific user
      experiences = await Experience.find({
        userId,
        published: true, // Only published experiences
      })
        .sort({ order: 1, startDate: -1 }) // Sort by order first, then by start date (newest first)
        .lean()
        .exec();
    } else {
      // Get all published experiences (for main portfolio - single user site)
      experiences = await Experience.find({
        published: true,
      })
        .sort({ order: 1, startDate: -1 })
        .lean()
        .exec();
    }

    if (!experiences || experiences.length === 0) {
      res.status(404).json({
        code: "ExperiencesNotFound",
        message: "No published experiences found",
      });
      logger.warn("No published experiences found");
      return;
    }

    logger.info(`Retrieved ${experiences.length} experiences successfully`);

    res.status(200).json({
      experiences: experiences,
      count: experiences.length,
    });
  } catch (error) {
    res.status(500).json({
      code: "ServerError",
      message: "Internal server error",
      error: error,
    });
    logger.error("Error while retrieving experiences", error);
  }
};

export default getExperiences;