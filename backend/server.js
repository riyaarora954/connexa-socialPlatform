import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import postRoutes from "./routes/posts.routes.js";
import userRoutes from "./routes/user.routes.js";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(postRoutes);
app.use(userRoutes);
app.use(express.static("uploads"));
const start = async () => {
  const connectDB = await mongoose.connect(
    "mongodb+srv://arorariya954:OGMG8xH1EWGUEf9Q@connexa.ps8ycew.mongodb.net/?retryWrites=true&w=majority&appName=Connexa"
  );
  app.listen(9090, () => {
    console.log("Server is running on port 9090");
  });
};
start();
