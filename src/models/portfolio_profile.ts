/**
 * Node module imports
 */
import { Schema, model } from "mongoose";

export interface ISocialLinks {
  github?: string;
  linkedin?: string;
  x?: string;
  website?: string;
  [key: string]: string | undefined;
}

export interface IPortfolioProfile {
  userId: Schema.Types.ObjectId;
  workAvailability: boolean;
  workTitle: string;
  aboutMe: string;
  description: string;
  email: string;
  phone?: string;
  location?: string;
  
  // Social Media
  socialLinks?: ISocialLinks;
  
  // Media
  resumeUrl?: string;
  published? : boolean;
  
}

const portfolioProfileSchema = new Schema<IPortfolioProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "userId is required"],
      unique: true,
    },
    workAvailability: {
      type: Boolean,
      required: [true, "workAvailability is required"],
      default: false,
    },
    workTitle: {
      type: String,
      required: [true, "workTitle is required"],
      maxLength: [100, "workTitle must be less than 100 characters"],
      trim: true,
    },
    aboutMe: {
      type: String,
      required: [true, "aboutMe is required"],
      maxLength: [500, "aboutMe must be less than 500 characters"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "description is required"],
      maxLength: [1000, "description must be less than 1000 characters"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    phone: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
      maxLength: [100, "location must be less than 100 characters"],
    },
    socialLinks: {
      github: { type: String, trim: true },
      linkedin: { type: String, trim: true },
      twitter: { type: String, trim: true },
      website: { type: String, trim: true },
    },
    resumeUrl: {
      type: String,
      trim: true,
    },
    published: {
      type: Boolean,
      required: true,
      default: false,
    }
  },
  {
    timestamps: true,
  }
);

export const PortfolioProfile = model<IPortfolioProfile>(
  "PortfolioProfile",
  portfolioProfileSchema
);
