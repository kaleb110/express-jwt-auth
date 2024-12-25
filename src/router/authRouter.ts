import { refreshTokenHandler } from "./../auth/refreshTokenHandler";
import { logoutHandler } from "./../auth/logout";
import { limiter } from "./../middleware/rateLimiter";
import express from "express";
import registerHandler  from "../auth/register";
import loginHandler from "../auth/login";
import verifyEmailHandler from "../auth/emailVerfication";
import {
  resetPasswordHandler,
  requestPasswordResetHandler,
} from "../auth/resetPassword";
const authRouter = express.Router();

// rate limiter
authRouter.use(limiter);

// Auth routes
authRouter.post("/register", registerHandler);
authRouter.post("/login", loginHandler);
authRouter.post("/logout", logoutHandler);
authRouter.post("/verify-email", verifyEmailHandler);
authRouter.post("/request-reset-password", requestPasswordResetHandler);
authRouter.post("/reset-password", resetPasswordHandler);

// refresh token router

authRouter.post("/refresh", refreshTokenHandler);

export default authRouter;
