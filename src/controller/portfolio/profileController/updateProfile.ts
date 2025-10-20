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
import type { IPortfolioProfile } from "@/models/portfolio_profile";

type UpdateProfileData = Partial<Pick<IPortfolioProfile,
    | "workAvailability"
    | "workTitle"
    | "aboutMe"
    | "description"
    | "email"
    | "phone"
    | "location"
    | "socialLinks"
    | "resumeUrl"
    | "published"
  >>;

const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const updateData = req.body as UpdateProfileData;

    // Find the portfolio profile
    const profile = await PortfolioProfile.findOne({ userId });

    if (!profile) {
      res.status(404).json({
        code: "ProfileNotFound",
        message: "Portfolio profile not found",
      });
      logger.warn(`Portfolio profile not found for user: ${userId}`);
      return;
    }

    // Update the profile with new data
    Object.assign(profile, updateData);
    await profile.save();

    logger.info("Portfolio profile updated successfully", { userId });

    res.status(200).json({
      message: "Portfolio profile updated successfully",
      profile: profile,
    });
  } catch (error) {
    res.status(500).json({
      code: "ServerError",
      message: "Internal server error",
      error: error,
    });
    logger.error("Error while updating portfolio profile", error);
  }
};

export default updateProfile;