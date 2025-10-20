/**
 * Custom modules import
 */
import { logger } from "@/lib/winston";

/**
 * Models import
 */
import { PortfolioProfile } from "@/models/portfolio_profile";

/**
 * Types import
 */
import type { Request, Response } from "express";

const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    
    const { userId } = req.params;

    let profile;

    if (userId) {
      // Get specific user's portfolio
      profile = await PortfolioProfile.findOne({ userId }).lean().exec();
    } else {
      // Get the first/main portfolio (for single user portfolio site)
      profile = await PortfolioProfile.findOne().lean().exec();
    }

    if (!profile) {
      res.status(404).json({
        code: "ProfileNotFound",
        message: "Portfolio profile not found",
      });
      logger.warn("Portfolio profile not found");
      return;
    }

    logger.info("Portfolio profile retrieved successfully");

    // Check if profile is published
    if (!profile.published) {
      res.status(403).json({
        code: "ProfileNotPublished",
        message: "Portfolio profile is not published yet",
      });
      logger.warn("Attempted to access unpublished portfolio profile");
      return;
    }
    
    res.status(200).json({
      profile: profile,
    });
  } catch (error) {
    res.status(500).json({
      code: "ServerError",
      message: "Internal server error",
      error: error,
    });
    logger.error("Error while retrieving portfolio profile", error);
  }
};

export default getProfile;