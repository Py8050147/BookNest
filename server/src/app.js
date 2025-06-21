import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"
const app = express();




app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    allowedHeaders: true,
    // methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
);

app.use(express.json());
app.use(express.static("public"))
app.use(cookieParser())

import userRouter from "./router/user.router.js";
import bookRouter from "./router/book.router.js"
app.use("/api/users", userRouter)
app.use("/api/books", bookRouter)

export { app };
