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

type ProjectData = Pick<IProject,
  | "title"
  | "description"
  | "shortDescription"
  | "projectUrl"
  | "githubUrl"
  | "technologies"
  | "category"
  | "startDate"
  | "endDate"
  | "isFeatured"
  | "order"
  | "published"
>;

const createProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      title,
      description,
      shortDescription,
      projectUrl,
      githubUrl,
      technologies,
      category,
      startDate,
      endDate,
      isFeatured,
      order,
      published,
    } = req.body as ProjectData;

    const userId = req.user?.id;

    // Check if image file is uploaded
    if (!req.file) {
      res.status(400).json({
        code: "ImageRequired",
        message: "Project image is required",
      });
      return;
    }

    // Convert buffer to base64 for Cloudinary upload
    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    // Upload image to Cloudinary
    const uploadResult = await uploadToCloudinary(base64Image, 'portfolio/projects');

    // Parse technologies if it's a string (from form-data)
    const parsedTechnologies = typeof technologies === 'string' 
      ? JSON.parse(technologies) 
      : technologies;

    const newProject = await Project.create({
      userId,
      title,
      description,
      shortDescription,
      image: uploadResult.secure_url,
      projectUrl,
      githubUrl,
      technologies: parsedTechnologies,
      category,
      startDate,
      endDate,
      isFeatured,
      order,
      published,
    });

    logger.info("New project created", newProject);

    res.status(201).json({
      project: newProject,
    });
  } catch (error) {
    res.status(500).json({
      code: "ServerError",
      message: "Internal server error",
      error: error,
    });
    logger.error("Error while creating project", error);
  }
};

export default createProject;