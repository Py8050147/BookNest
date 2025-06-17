import dotenv from "dotenv";
import { app } from "./app.js";
import connectDb from "./db/index.js"

dotenv.config({
  path: "./.env",
});

connectDb()
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log(`o server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("MONGOdb connection failed !!!", error);
  });
