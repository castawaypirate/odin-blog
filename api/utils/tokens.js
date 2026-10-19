import jwt from "jsonwebtoken";
import crypto from "crypto";

export function generateAccessToken(user) {
  return jwt.sign({ userId: user.id }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "5m",
  });
}

export function generateRefreshToken() {
  const token = crypto.randomBytes(16).toString("base64url");
  return token;
}

export function generateTokens(user) {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken();
  return { accessToken, refreshToken };
}

export function hashToken(token) {
  return crypto.createHash("sha512").update(token).digest("hex");
}
