import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../db/schema";
import { db } from "../db/index";
import { eq } from "drizzle-orm";

const JWT_SECRET = process.env.JWT_SECRET_KEY!;
const verifyEmailHandler = async (req: Request, res: Response) => {
  const { token } = req.body;

  try {
    const decoded = jwt.verify(token as string, JWT_SECRET) as jwt.JwtPayload;
    const userResult = await db
      .select()
      .from(User)
      .where(eq(User.id, decoded.userId))
      .limit(1);

    const user = userResult[0];
    if (!user) return res.status(400).send("Invalid link");

    await db
      .update(User)
      .set({ verified: true })
      .where(eq(User.id, decoded.userId));
    res.send("Email verified successfully");
  } catch (error) {
    res.status(400).send("Invalid or expired token");
  }
};

export default verifyEmailHandler;
