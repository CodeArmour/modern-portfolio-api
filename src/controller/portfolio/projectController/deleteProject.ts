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

const deleteProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Find the project
    const project = await Project.findById(id);
    if (!project) {
      res.status(404).json({
        code: "ProjectNotFound",
        message: "Project not found",
      });
      logger.warn(`Project not found with id: ${id}`);
      return;
    }

    // Optional: Delete image from Cloudinary if it exists
    if (project.image) {
      try {
        await deleteFromCloudinary(project.image);
        logger.info(`Deleted project image from Cloudinary for id: ${id}`);
      } catch (cloudErr) {
        logger.warn(`Failed to delete image from Cloudinary for project ${id}:`, cloudErr);
      }
    }

    // Delete project from DB
    await project.deleteOne();

    logger.info(`Project deleted successfully: ${id}`);

    res.status(200).json({
      message: "Project deleted successfully",
      deletedProjectId: id,
    });
  } catch (error) {
    res.status(500).json({
      code: "ServerError",
      message: "Internal server error",
      error,
    });
    logger.error("Error while deleting portfolio project", error);
  }
};

export default deleteProject;
