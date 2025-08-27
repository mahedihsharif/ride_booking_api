import bcryptjs from "bcryptjs";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import {
  createNewAccessTokenWithRefreshToken,
  createUserTokens,
} from "../../utils/userTokens";
import { ApprovedStatus } from "../driver/driver.interface";
import { Driver } from "../driver/driver.model";
import { IUser, Role } from "../user/user.interface";
import { User } from "../user/user.model";

const credentialsLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  const isUserExist = await User.findOne({ email });
  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User doesn't exist!");
  }

  if (isUserExist.role === Role.DRIVER) {
    const driver = await Driver.findOne({ user: isUserExist._id });
    if (!driver) {
      throw new AppError(httpStatus.BAD_REQUEST, "Driver not found");
    }

    if (driver.isApprovedStatus === ApprovedStatus.SUSPENDED) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "Your account is suspended, please contact our support system"
      );
    }
  }

  const isPasswordMatched = await bcryptjs.compare(
    password as string,
    isUserExist.password as string
  );

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password!");
  }

  const userTokens = createUserTokens(isUserExist);

  const { password: pass, ...rest } = isUserExist.toObject();

  return {
    accessToken: userTokens.accessToken,
    refreshToken: userTokens.refreshToken,
    user: rest,
  };
};

const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createNewAccessTokenWithRefreshToken(
    refreshToken
  );

  return {
    accessToken: newAccessToken,
  };
};

const changePassword = async (
  oldPassword: string,
  newPassword: string,
  confirmPassword: string,
  decodedToken: JwtPayload
) => {
  const existPassword = oldPassword === newPassword;
  if (existPassword) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Password is already Exist, please select new password for change"
    );
  }
  const user = await User.findById(decodedToken.userId);

  const isOldPasswordMatched = await bcryptjs.compare(
    oldPassword,
    user!.password as string
  );

  if (!isOldPasswordMatched) {
    throw new AppError(httpStatus.BAD_REQUEST, "Old Password doesn't matched!");
  }

  const savedPassword = newPassword === confirmPassword;
  if (!savedPassword) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "New Password and Confirm Password doesn't matched"
    );
  }

  const newHashedPassword = await bcryptjs.hash(
    newPassword,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  user!.password = newHashedPassword;
  user!.save();
};

export const AuthServices = {
  credentialsLogin,
  getNewAccessToken,
  changePassword,
};
