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

type ExperienceData = Pick<
  IExperience,
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
>;

const createExperience = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      company,
      position,
      description,
      location,
      employmentType,
      startDate,
      endDate,
      isCurrent,
      technologies,
      order,
      published,
    } = req.body as ExperienceData;

    const userId = req.user?.id;

    const newExperience = await Experience.create({
      userId,
      company,
      position,
      description,
      location,
      employmentType,
      startDate,
      endDate,
      isCurrent,
      technologies,
      order,
      published,
    });

    logger.info("New experience created", newExperience);

    res.status(201).json({
      experience: newExperience,
    });
  } catch (error) {
    res.status(500).json({
      code: "ServerError",
      message: "Internal server error",
      error: error,
    });
    logger.error("Error while creating experience", error);
  }
};

export default createExperience;