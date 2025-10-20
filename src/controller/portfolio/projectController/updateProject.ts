/**
 * Custom modules import
 */
import { logger } from "@/lib/winston";
import { uploadToCloudinary } from "@/lib/cloudinary";

/**
 * Models import
 */
import { Project } from "@/models/portfolio_project";

/**
 * Types import
 */
import type { Request, Response } from "express";
import type { IProject } from "@/models/portfolio_project";

type UpdateProjectData = Partial<
  Pick<
    IProject,
    | "title"
    | "description"
    | "shortDescription"
    | "image"
    | "images"
    | "projectUrl"
    | "githubUrl"
    | "technologies"
    | "category"
    | "startDate"
    | "endDate"
    | "isFeatured"
    | "order"
    | "published"
  >
>;

const updateProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body as UpdateProjectData;

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

    // Handle image upload (if a new file is provided)
    if (req.file) {
      const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
      const uploadResult = await uploadToCloudinary(base64Image, "portfolio/projects");
      updateData.image = uploadResult.secure_url;
    }

    // Handle technologies parsing (stringified JSON in form-data)
    if (updateData.technologies && typeof updateData.technologies === "string") {
      try {
        updateData.technologies = JSON.parse(updateData.technologies);
      } catch {
        res.status(400).json({
          code: "InvalidTechnologiesFormat",
          message: "Technologies must be a valid JSON array",
        });
        return;
      }
    }

    // Merge new data into existing project
    Object.assign(project, updateData);

    await project.save();

    logger.info(`Project updated successfully: ${project._id}`);

    res.status(200).json({
      message: "Project updated successfully",
      project,
    });
  } catch (error) {
    res.status(500).json({
      code: "ServerError",
      message: "Internal server error",
      error,
    });
    logger.error("Error while updating portfolio project", error);
  }
};

export default updateProject;
