import bcryptjs from "bcryptjs";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { Blocked, IUser, Role } from "./user.interface";
import { User } from "./user.model";

const createUser = async (payload: IUser) => {
  const { email, password, ...rest } = payload;

  const isUserExist = await User.findOne({ email });
  if (isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist!");
  }

  const hashedPassword = await bcryptjs.hash(
    password as string,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  const user = await User.create({
    email,
    password: hashedPassword,
    ...rest,
  });
  return user;
};

const getAllUsers = async () => {
  const users = await User.find({});
  const totalUsers = await User.countDocuments();
  return {
    data: users,
    meta: {
      total: totalUsers,
    },
  };
};

const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  const isExistUser = await User.findById(userId);
  if (!isExistUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User doesn't found!");
  }

  // 1. Check if trying to update someone else's data
  const isSelf = decodedToken.userId === userId;

  if (!isSelf) {
    if (decodedToken.role === Role.RIDER || decodedToken.role === Role.DRIVER) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You are not authorized to update other users' data!"
      );
    }

    if (decodedToken.role === Role.ADMIN && isExistUser.role === Role.ADMIN) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "Admin cannot update other Admin"
      );
    }
  }

  // 2. If trying to change role
  if (payload.role) {
    if (decodedToken.role === Role.RIDER || decodedToken.role === Role.DRIVER) {
      if (payload.role === Role.ADMIN) {
        throw new AppError(
          httpStatus.FORBIDDEN,
          "You are not authorized to change admin roles!"
        );
      }
    }
  }

  if (payload.password) {
    payload.password = await bcryptjs.hash(
      payload.password,
      envVars.BCRYPT_SALT_ROUND
    );
  }

  const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return newUpdatedUser;
};

const blockedUser = async (userId: string, decodedToken: JwtPayload) => {
  const isExistUser = await User.findById(userId);
  if (!isExistUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User doesn't found!");
  }

  if (decodedToken.role === Role.RIDER || decodedToken.role === Role.DRIVER) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to view this route."
    );
  }

  if (isExistUser.isBlocked !== Blocked.UN_BLOCKED) {
    isExistUser.isBlocked = Blocked.UN_BLOCKED;
    await isExistUser.save();
    return isExistUser;
  }

  isExistUser.isBlocked = Blocked.BLOCKED;
  await isExistUser.save();
  return isExistUser;
};

export const UserService = { createUser, getAllUsers, updateUser, blockedUser };
