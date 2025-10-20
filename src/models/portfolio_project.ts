/**
 * Node module imports
 */
import { Schema, model } from "mongoose";

export interface IProject {
  userId: Schema.Types.ObjectId;
  title: string;
  description: string;
  shortDescription?: string;
  image: string;
  images?: string[]; // Additional project images
  projectUrl?: string;
  githubUrl?: string;
  technologies: string[];
  category?: string; // Web App, Mobile App, UI/UX, etc.
  startDate?: Date;
  endDate?: Date;
  isFeatured: boolean;
  order: number;
  published: boolean;
}

const projectSchema = new Schema<IProject>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "userId is required"],
      index: true,
    },
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
      maxLength: [100, "Title must be less than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxLength: [3000, "Description must be less than 3000 characters"],
    },
    shortDescription: {
      type: String,
      trim: true,
      maxLength: [200, "Short description must be less than 200 characters"],
    },
    image: {
      type: String,
      required: [true, "Project image is required"],
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
    projectUrl: {
      type: String,
      trim: true,
    },
    githubUrl: {
      type: String,
      trim: true,
    },
    technologies: {
      type: [String],
      required: [true, "At least one technology is required"],
      validate: {
        validator: function (technologies: string[]) {
          return technologies.length > 0 && technologies.length <= 20;
        },
        message: "Technologies must contain between 1 and 20 items",
      },
    },
    category: {
      type: String,
      enum: [
        "Web Application",
        "Mobile Application",
        "Desktop Application",
        "UI/UX Design",
        "API/Backend",
        "Other",
      ],
      trim: true,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      required: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    published: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
projectSchema.index({ userId: 1, order: 1 });
projectSchema.index({ userId: 1, published: 1 });
projectSchema.index({ isFeatured: 1 });
projectSchema.index({ category: 1 });

export const Project = model<IProject>("Project", projectSchema);