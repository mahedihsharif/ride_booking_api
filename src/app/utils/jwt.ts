import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

 type TTokenPayload = {
  userId: string;
  email: string;
  role: string;
};

export const generateToken = (
  payload: TTokenPayload,
  secret: string,
  expiresIn: string
) => {
  const token = jwt.sign(payload, secret, { expiresIn } as SignOptions);
  return token;
};

export const verifyToken = (token: string, secret: string) => {
  const verifiedToken = jwt.verify(token, secret);
  return verifiedToken;
};
