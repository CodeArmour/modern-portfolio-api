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

const deleteProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    // Find and delete the portfolio profile
    const profile = await PortfolioProfile.findOneAndDelete({ userId });

    if (!profile) {
      res.status(404).json({
        code: "ProfileNotFound",
        message: "Portfolio profile not found",
      });
      logger.warn(`Portfolio profile not found for user: ${userId}`);
      return;
    }

    logger.info("Portfolio profile deleted successfully", { userId });

    res.status(200).json({
      message: "Portfolio profile deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      code: "ServerError",
      message: "Internal server error",
      error: error,
    });
    logger.error("Error while deleting portfolio profile", error);
  }
};

export default deleteProfile;