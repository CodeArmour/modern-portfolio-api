import type { Request, Response, NextFunction } from "express";
import { logger } from "@/lib/winston";

type Role = "user" | "admin" | undefined;

const authorization = (allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        code: "AuthorizationError",
        message: "You don't have permission to access this feature",
      });
      return;
    }

    next();
  };
};
export default authorization;
