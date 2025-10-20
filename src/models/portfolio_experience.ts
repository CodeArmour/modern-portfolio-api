/**
 * Node module imports
 */
import { Schema, model } from "mongoose";

export interface IExperience {
  userId: Schema.Types.ObjectId;
  company: string;
  position: string;
  description: string;
  location?: string;
  employmentType?: string; // Full-time, Part-time, Contract, Freelance, Internship
  startDate: Date;
  endDate?: Date;
  isCurrent: boolean;
  technologies?: string[]; // Technologies used in this role
  order: number; // For sorting experiences
  published: boolean;
}

const experienceSchema = new Schema<IExperience>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "userId is required"],
      index: true,
    },
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      maxLength: [100, "Company name must be less than 100 characters"],
    },
    position: {
      type: String,
      required: [true, "Position is required"],
      trim: true,
      maxLength: [100, "Position must be less than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxLength: [2000, "Description must be less than 2000 characters"],
    },
    location: {
      type: String,
      trim: true,
      maxLength: [100, "Location must be less than 100 characters"],
    },
    employmentType: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Freelance", "Internship"],
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
    },
    isCurrent: {
      type: Boolean,
      default: false,
      required: true,
    },
    technologies: {
      type: [String],
      default: [],
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
experienceSchema.index({ userId: 1, order: 1 });
experienceSchema.index({ userId: 1, published: 1 });
experienceSchema.index({ isCurrent: 1 });

// Validation: If isCurrent is false, endDate should be provided
experienceSchema.pre("save", function (next) {
  if (!this.isCurrent && !this.endDate) {
    next(new Error("End date is required when position is not current"));
  }
  
  // If isCurrent is true, clear endDate
  if (this.isCurrent) {
    this.endDate = undefined;
  }
  
  next();
});

/**
 * {
  "company": "Tech Corp Inc.",
  "position": "Senior Full Stack Developer",
  "description": "Led development of microservices architecture serving 1M+ users. Mentored junior developers and improved code quality through comprehensive code reviews.",
  "location": "San Francisco, CA",
  "employmentType": "Full-time",
  "startDate": "2022-01-15",
  "endDate": "2024-06-30",
  "isCurrent": false,
  "technologies": ["React", "Node.js", "MongoDB", "AWS", "Docker"],
  "order": 1,
  "published": true
}
 */

export const Experience = model<IExperience>("Experience", experienceSchema);