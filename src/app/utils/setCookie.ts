import { Response } from "express";

export interface AuthTokens {
  accessToken?: string;
  refreshToken?: string;
}

export const setAuthCookie = (res: Response, loginInfo: AuthTokens) => {
  if (loginInfo.accessToken) {
    res.cookie("accessToken", loginInfo.accessToken, {
      httpOnly: true,
      secure: false,
    });
  }

  if (loginInfo.refreshToken) {
    res.cookie("refreshToken", loginInfo.refreshToken, {
      httpOnly: true,
      secure: false,
    });
  }
};
