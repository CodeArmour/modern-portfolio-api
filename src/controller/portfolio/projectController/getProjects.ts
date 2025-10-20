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

const getProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { category, isFeatured, limit = 50, page = 1 } = req.query;

    // Determine if requester is an admin (assuming req.role set by middleware)
    const isAdmin = req.user?.role === "admin";

    // Build filter
    const filter: any = {};

    // Public users only see published projects
    if (!isAdmin) {
      filter.published = true;
    }

    if (userId) {
      filter.userId = userId;
    }

    if (category) {
      filter.category = category;
    }

    if (isFeatured !== undefined) {
      filter.isFeatured = isFeatured === "true";
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    const projects = await Project.find(filter)
      .sort({ order: 1, createdAt: -1 })
      .limit(Number(limit))
      .skip(skip)
      .lean()
      .exec();

    const totalProjects = await Project.countDocuments(filter);
    const totalPages = Math.ceil(totalProjects / Number(limit));

    if (!projects || projects.length === 0) {
      res.status(404).json({
        code: "ProjectsNotFound",
        message: isAdmin
          ? "No projects found"
          : "No published projects found",
      });
      logger.warn("No projects found for current filter");
      return;
    }

    logger.info(
      `Retrieved ${projects.length} ${isAdmin ? "admin" : "public"} projects successfully`
    );

    res.status(200).json({
      projects,
      pagination: {
        total: totalProjects,
        page: Number(page),
        limit: Number(limit),
        totalPages,
      },
    });
  } catch (error) {
    res.status(500).json({
      code: "ServerError",
      message: "Internal server error",
      error,
    });
    logger.error("Error while retrieving projects", error);
  }
};

export default getProjects;
