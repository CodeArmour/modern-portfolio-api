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
import type { IExperience } from "@/models/portfolio_experience";

type UpdateExperienceData = Partial <Pick<IExperience,
    | "company"
    | "position"
    | "description"
    | "location"
    | "employmentType"
    | "startDate"
    | "endDate"
    | "isCurrent"
    | "technologies"
    | "order"
    | "published"
  >>
;

const updateExperience = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body as UpdateExperienceData;

    // Find the experience
    const experience = await Experience.findById(id);

    if (!experience) {
      res.status(404).json({
        code: "ExperienceNotFound",
        message: "Experience not found",
      });
      logger.warn(`Experience not found with id: ${id}`);
      return;
    }

    // Update the experience with new data
    Object.assign(experience, updateData);
    await experience.save();

    logger.info("Experience updated successfully", { id });

    res.status(200).json({
      message: "Experience updated successfully",
      experience: experience,
    });
  } catch (error) {
    res.status(500).json({
      code: "ServerError",
      message: "Internal server error",
      error: error,
    });
    logger.error("Error while updating experience", error);
  }
};

export default updateExperience;