import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../db/schema";
import { db } from "../db/index";
import { eq } from "drizzle-orm";
import { sendVerificationEmail } from "./sendEmail";

const isProd = process.env.NODE_ENV === "production";

const registerHandler = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res
        .status(400)
        .send("Name, Email, password, and role are required");
    }

    const existingUserResult = await db
      .select()
      .from(User)
      .where(eq(User.email, email))
      .limit(1);
    if (existingUserResult.length) {
      return res.status(400).send("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [user] = await db
      .insert(User)
      .values({ name, email, password: hashedPassword, role })
      .returning();
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET_KEY!,
      { expiresIn: "1h" }
    );
    const verificationLink = isProd
      ? `${process.env.BASE_URL_PROD}/auth/login?token=${token}`
      : `${process.env.BASE_URL}/auth/login?token=${token}`;

    await sendVerificationEmail(email, verificationLink);

    res.send(
      "Registration successful. Check your email to verify your account."
    );
  } catch (error: any) {
    console.error("Error during registration:", error.message);
    res.status(500).send("An error occurred during registration");
  }
};

export default registerHandler;
