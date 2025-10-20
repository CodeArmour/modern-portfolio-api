/**
 * Custom modules
 */
import { logger } from '@/lib/winston';
import config from '@/config';

/**
 * Models
 */
import User from '@/models/user';

/**
 * Types
 */
import type { Request, Response } from 'express';

const logout = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id;

  try {
    // Set current refreshToken to null
    await User.updateOne({ _id: userId }, { refreshToken: null });

    // Clear the cookie from client
    res.clearCookie('refreshToken', {
      httpOnly: config.NODE_ENV === 'production',
      secure: true,
      sameSite: 'strict',
    });

    // Response success with no content
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
    });
    logger.error('Error during user logout:', error);
  }
};

export default logout;
