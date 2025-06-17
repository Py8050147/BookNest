import express from "express";
import cors from "cors";
const app = express();

const PORT = 3000;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    allowedHeaders: true,
    // methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
);

export { app };
