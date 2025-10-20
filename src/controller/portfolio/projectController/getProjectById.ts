/**
 * Custom modules import
 */
import { logger } from "@/lib/winston";

/**
 * Models import
 */
import { Project } from "@/models/portfolio_project";

/**
 * Types import
 */
import type { Request, Response } from "express";

const getProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id).lean().exec();

    if (!project) {
      res.status(404).json({
        code: "ProjectNotFound",
        message: "Project not found",
      });
      logger.warn(`Project not found with id: ${id}`);
      return;
    }

    // Check if project is published (for public access)
    if (!project.published) {
      res.status(403).json({
        code: "ProjectNotPublished",
        message: "Project is not published yet",
      });
      logger.warn("Attempted to access unpublished project");
      return;
    }

    logger.info("Project retrieved successfully", { id });

    res.status(200).json({
      project: project,
    });
  } catch (error) {
    res.status(500).json({
      code: "ServerError",
      message: "Internal server error",
      error: error,
    });
    logger.error("Error while retrieving project", error);
  }
};

export default getProject;