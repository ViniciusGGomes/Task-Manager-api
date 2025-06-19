import { Request, Response, NextFunction } from "express";
import { AppError } from "@/utils/AppError";

function verifyUserAuthorization(role: string[]) {
  return (request: Request, response: Response, next: NextFunction) => {
    if (!request.user) {
      throw new AppError("Unauthorized");
    }

    if (!role.includes(request.user.role)) {
      throw new AppError("Unauthorized");
    }

    next();
  };
}

export { verifyUserAuthorization };
