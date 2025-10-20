/**
 * Custom modules import
 */
import { logger } from "@/lib/winston";
import { deleteFromCloudinary } from "@/lib/cloudinary";

/**
 * Models import
 */
import { Project } from "@/models/portfolio_project";

/**
 * Types import
 */
import type { Request, Response } from "express";

const deleteMultipleProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ids } = req.body as { ids: string[] };

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      res.status(400).json({
        code: "InvalidRequest",
        message: "An array of project IDs is required",
      });
      return;
    }

    // Fetch projects to clean up Cloudinary images
    const projects = await Project.find({ _id: { $in: ids } });

    if (projects.length === 0) {
      res.status(404).json({
        code: "ProjectsNotFound",
        message: "No projects found for the provided IDs",
      });
      return;
    }

    // Delete images from Cloudinary (optional)
    for (const project of projects) {
      if (project.image) {
        try {
          await deleteFromCloudinary(project.image);
        } catch (err) {
          logger.warn(`Failed to delete image for project ${project._id}:`, err);
        }
      }
    }

    // Delete projects from DB
    const result = await Project.deleteMany({ _id: { $in: ids } });

    logger.info(`Deleted ${result.deletedCount} projects`);

    res.status(200).json({
      message: "Projects deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({
      code: "ServerError",
      message: "Internal server error",
      error,
    });
    logger.error("Error while deleting multiple projects", error);
  }
};

export default deleteMultipleProjects;
