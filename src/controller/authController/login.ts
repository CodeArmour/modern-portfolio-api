/**
 * Node Modeules
 */
import bcrypt from "bcrypt";

/**
 * Custom modules
 */
import { generateAccessToken, generateRefreshToken } from "@/lib/jwt";
import { logger } from "@/lib/winston";
import config from "@/config";

/**
 * Models
 */
import User from '@/models/user';

/**
 * Types
 */
import type { Request, Response } from "express";
import type { IUser } from "@/models/user";
type RequestBody = Pick<IUser, 'email' | 'password'>;


const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body as RequestBody;

    try {
        // Validate input
        if (!email || !password) {
            res.status(400).json({
                code: "ValidationError",
                message: "Email and password are required",
            });
            return;
        }

        // Find user by email
        const user = await User.findOne({ email }).select('+password').exec();

        // Return if user doesn't exist
        if (!user) {
            res.status(401).json({
                code: "AuthenticationError",
                message: "Invalid email or password",
            });
            return;
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({
                code: "AuthenticationError",
                message: "Invalid email or password",
            });
            return;
        }

        // Generate tokens
        const refreshToken = generateRefreshToken({ userId: user._id, role: user.role });
        const accessToken = generateAccessToken({ userId: user._id, role: user.role });


        // Update user with new refreshToken
        user.refreshToken = refreshToken;
        await user.save();

        // Set refreshToken as httpOnly cookie
        res.cookie('refreshToken', refreshToken, {
            maxAge: config.COOKIE_MAX_AGE,
            httpOnly: true, // Always true for security
            secure: config.NODE_ENV === 'production', // HTTPS only in production
            sameSite: 'strict', // CSRF protection
        });

        res.status(200).json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            accessToken,
        });

    } catch (error) {
        res.status(500).json({
            code: "ServerError",
            message: "Internal server error",
        });
        logger.error("Error during user login:", error);
    }
};

export default login;