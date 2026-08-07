import express from "express";
import cors from "cors";
import { env } from "./config/env";
import authRoutes from "./routes/authRoutes";
import memberRoutes from "./routes/memberRoutes";
import { errorMiddleware, notFoundMiddleware } from "./middleware/errorMiddleware";

const app = express();

// Only the admin dashboard and the public website may call this API.
const allowedOrigins = [env.corsOriginAdmin, env.corsOriginWeb];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/members", memberRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware); // must be last

export default app;
