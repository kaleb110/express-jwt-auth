import { errorHandler } from "./middleware/errorHandler";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { Application } from "express";
import authRouter from "./router/authRouter";
import { verifyToken } from "./middleware/authMiddleware";
dotenv.config();
const app: Application = express();
const isProd = process.env.NODE_ENV === "production";

const allowedOrigins = isProd
  ? [process.env.BASE_URL_PROD!]
  : [process.env.BASE_URL!];

// 1. set security headers with helmet
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginOpenerPolicy: { policy: "unsafe-none" },
  })
);

// 2. Configure and apply CORS
const corsOptions = {
  origin: function (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
  ],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// set proxy security in header
app.set("trust proxy", 1);

// parse JSON
app.use(express.json());

// initiate cookie parser
app.use(cookieParser());

// global error handler
app.use(errorHandler);

// authentication routes
app.use("api/auth", authRouter);

// verify routes with token after authenticated
app.use(verifyToken);

// TODO:define your routes here to be verified with token

// server listening on port 5000
app.listen(5000, () => {
  console.log(`Server is running on http://localhost:5000/api`);
});
