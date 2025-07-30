import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";
import handleCastError from "../helpers/handleCastError";
import handleDuplicateError from "../helpers/handleDuplicateError";
import handleValidationError from "../helpers/handleValidationError";
import handleZodError from "../helpers/handleZodError";
import { TErrorSources } from "../interface/error.types";

const globalErrorHandler = (
  err: any,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  let errorSources: TErrorSources[] = [];
  let statusCode = 500;
  let message = "Something went to wrong!!";

  // mongoose duplicate key error
  if (err.code === 11000) {
    const simplifiedError = handleDuplicateError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  }
  // mongoose cast error or ObjectId Error
  else if (err.name === "CastError") {
    const simplifiedError = handleCastError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  }
  //zod validation error
  else if (err.name === "ZodError") {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode;
    errorSources = simplifiedError.errorSources as TErrorSources[];
    message = simplifiedError.message;
  }
  // mongoose validation error
  else if (err.name === "ValidationError") {
    const simplifiedError = handleValidationError(err);
    statusCode = simplifiedError.statusCode;
    errorSources = simplifiedError.errorSources as TErrorSources[];
    message = simplifiedError.message;
  }
  //custom app error
  else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    statusCode = 500;
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    errorSources,
    message,
    err: envVars.NODE_ENV === "development" ? err : null,
    stack: envVars.NODE_ENV === "development" ? err.stack : null,
  });
};

export default globalErrorHandler;
