import { eq } from "drizzle-orm";
import { User } from "../db/schema";
import { db } from "../db/index";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const isProd = process.env.NODE_ENV === "production";
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY!;
const ACCESS_TOKEN_EXPIRATION = process.env.TOKEN_EXPIRATION!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN!;
const REFRESH_TOKEN_EXPIRATION = process.env.REFRESH_TOKEN_EXPIRATION!;

const loginHandler = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const userResult = await db
      .select()
      .from(User)
      .where(eq(User.email, email))
      .limit(1);

    const user = userResult[0];
    if (!user || !user.verified) {
      return res.status(400).send("Invalid email or email not verified");
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).send("Invalid password");

    // generate access token
    const accessToken = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET_KEY,
      { expiresIn: ACCESS_TOKEN_EXPIRATION }
    );

    // generate refresh token
    const refreshToken = jwt.sign(
      { userId: user.id, role: user.role },
      REFRESH_TOKEN_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRATION }
    );

    // Store refresh token in HttpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProd, // Secure in production
      sameSite: isProd ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });

    res.send({ token: accessToken });
  } catch (error) {
    res.status(500).json({ message: "An error occurred during login", error });
  }
};

export default loginHandler;
