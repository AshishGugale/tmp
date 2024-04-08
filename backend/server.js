import mongoose from "mongoose";
import cors from "cors";
import express from "express";
import "dotenv/config";
import UserRouter from './routes/UserRoutes.js'
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGOURL = process.env.MONGODBURL;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use('/user', UserRouter)

mongoose
  .connect(MONGOURL)
  .then(() => {
    console.log("DB Connection Successful");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
