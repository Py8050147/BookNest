import mongoose from "mongoose";
import { DB_NAME } from "../contant.js";

const connectDB = async () => {
  try {
    const connectionDb = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(
      `\n MONGODB Connected !! DB HOST:${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit the process with failure
  }
};
