/**
 * Node module imports
 */
import { Schema, model } from "mongoose";

export interface IMessage {
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  isReplied: boolean;
  repliedAt?: Date;
  ipAddress?: string;
  userAgent?: string;
}

const messageSchema = new Schema<IMessage>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxLength: [100, "Name must be less than 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      minLength: [10, "Message must be at least 10 characters"],
      maxLength: [5000, "Message must be less than 5000 characters"],
    },
    isRead: {
      type: Boolean,
      default: false,
      required: true,
    },
    isReplied: {
      type: Boolean,
      default: false,
      required: true,
    },
    repliedAt: {
      type: Date,
    },
    ipAddress: {
      type: String,
      trim: true,
    },
    userAgent: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, // This adds createdAt and updatedAt automatically
  }
);

// Indexes for better query performance
messageSchema.index({ email: 1 });
messageSchema.index({ isRead: 1 });
messageSchema.index({ createdAt: -1 });

export const Message = model<IMessage>("Message", messageSchema);