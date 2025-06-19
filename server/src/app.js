import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"
const app = express();
import userRouter from "./router/user.router.js";



app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    allowedHeaders: true,
    // methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
);

app.use(express.static("public"))
app.use(cookieParser())
app.use("/api/v2/users", userRouter)

export { app };
