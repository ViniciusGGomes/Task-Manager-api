import { Request, Response, NextFunction } from "express";
import { AppError } from "@/utils/AppError";
import { verify } from "jsonwebtoken";
import { authConfig } from "@/config/auth";

interface TokenPayload {
  role: string;
  sub: string;
}

function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const authHeaders = request.headers.authorization;

    if (!authHeaders) {
      throw new AppError("JWT token not found", 401);
    }
    
    const [, token] = authHeaders.split(" ");

    console.log(token);

    const { role, sub: user_id } = verify(
      token,
      authConfig.jwt.secret
    ) as TokenPayload;

    request.user = {
      id: user_id,
      role,
    };

    next();
  } catch (error) {
    throw new AppError("Invalid JWT token", 401);
  }
}

export { ensureAuthenticated };
