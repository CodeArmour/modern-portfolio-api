/**
 * Node module imports
 */
import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  totalVisitCount: number;
  passwordResetToken: string | null;
  refreshToken: string | null;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      maxLength: [20, "name must be less than 20 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      maxLength: [50, "Email msut be less than 50 characters"],
      unique: [true, "Email must be unique"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      enum: {
        values: ["user", "admin"],
        message: "{VALUE} is not supported",
      },
      default: "user",
    },
    totalVisitCount: {
        type: Number,
        default: 0,
    },
    passwordResetToken: {
        type: String,
        default: null,
        select: false,
    },
    refreshToken: {
        type: String,
        default: null,
        select: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
    return;
  }

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export default model<IUser>("User", userSchema);
