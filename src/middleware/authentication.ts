import { logger } from "@/lib/winston";
import { verifyAccessToken } from "@/lib/jwt";
import type { Request, Response, NextFunction } from "express";
import { TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";
import type { TokenPayload } from "@/lib/jwt";

const authentication = (req: Request, res: Response, next: NextFunction): void => {
  const { authorization } = req.headers;

  if (!authorization) {
    res.status(401).json({ code: "TokenError", message: "Access token is required" });
    return;
  }

  const [_, accessToken] = authorization.split(" ");

  try {
    const { userId, role } = verifyAccessToken(accessToken) as TokenPayload;

    // ✅ attach user object
    req.user = {
      id: userId,
      role,
    };

    next();
  } catch (error) {
    // handle JWT errors...
  }
};


export default authentication;
