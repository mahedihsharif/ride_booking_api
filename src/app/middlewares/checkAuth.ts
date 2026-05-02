import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";
import { User } from "../modules/user/user.model";
import { verifyToken } from "../utils/jwt";

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      const cookieToken = req.cookies?.accessToken;

      let accessToken: string | undefined;

      if (authHeader && authHeader.startsWith("Bearer ")) {
        accessToken = authHeader.split(" ")[1];
      } else if (authHeader) {
        accessToken = authHeader;
      } else {
        accessToken = cookieToken;
      }

      if (!accessToken) {
        throw new AppError(
          httpStatus.UNAUTHORIZED,
          "No Token Found! Please provide a valid token in Authorization header or login to get a new token.",
        );
      }

      const verifiedToken = verifyToken(
        accessToken,
        envVars.JWT.JWT_ACCESS_SECRET,
      ) as JwtPayload;

      const isUserExist = await User.findById(verifiedToken.userId);
      if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User doesn't exist!");
      }

      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError(
          httpStatus.FORBIDDEN,
          "You are not permitted to view this route",
        );
      }
      req.user = verifiedToken;

      next();
    } catch (err) {
      next(err);
    }
  };
