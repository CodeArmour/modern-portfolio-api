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

type ProfileData = Pick<
  IPortfolioProfile,
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
>;

const createProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      workAvailability,
      workTitle,
      aboutMe,
      description,
      email,
      phone,
      location,
      socialLinks,
      resumeUrl,
      published,
    } = req.body as ProfileData;

    const userId = req.user?.id;

    // Check if profile already exists
    const existingProfile = await PortfolioProfile.findOne({ userId });

    if (existingProfile) {
      res.status(409).json({
        code: "ProfileExists",
        message: "Portfolio profile already exists for this user",
      });
      logger.warn(`Portfolio profile already exists for user: ${userId}`);
      return;
    }

    const newProfile = await PortfolioProfile.create({
      userId,
      workAvailability,
      workTitle,
      aboutMe,
      description,
      email,
      phone,
      location,
      socialLinks,
      resumeUrl,
      published,
    });

    logger.info("New portfolio profile created", newProfile);

    res.status(201).json({
      profile: newProfile,
    });
  } catch (error) {
    res.status(500).json({
      code: "ServerError",
      message: "Internal server error",
      error: error,
    });
    logger.error("Error while creating portfolio profile", error);
  }
};

export default createProfile;