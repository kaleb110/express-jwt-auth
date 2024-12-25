import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()
interface AuthenticatedRequest extends Request {
  userId?: string;
}

interface JwtPayload {
  userId: string;
}

// Middleware to verify JWT and extract user information
export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).send("Access Denied: No Token Provided");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as JwtPayload;
    req.userId = decoded.userId; // Attach user information to the request object
    next();
  } catch (err) {
    res.status(400).send("Invalid Token");
  }
};

export const verifyToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as JwtPayload;
    req.userId = decoded.userId; // Extract userId from the token and attach to the request
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
 /**
 * Generates a secure JWT token with expiration
 * @param payload - The payload to encode in the token
 * @param expiresIn - Token expiration time
 */
export const generateToken = (payload: object, expiresIn: string | number) => {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY!, { expiresIn });
};

/**
 * Verifies the JWT token
 * @param token - The token to verify
 */
export const verifyJwtToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET_KEY!);
};