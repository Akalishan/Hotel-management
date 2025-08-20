import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./config/db.js";
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from "./controllers/clerkWebhooks.js";
import userRouter from "./routes/userRoutes.js";
import hotelRouter from "./routes/hotelRoutes.js";


connectDB(); 
const app = express();
app.use(cors()); //Enable cross-Origin Resource Sharing

//middleware
app.use(express.json());
app.use(clerkMiddleware)
//Api to listen to clerk webhooks
app.use("/api/clerk",clerkWebhooks)

app.get("/", (req, res) => {
  res.send("API is working");
});
app.use('/api/user',userRouter);
app.use('/api/hotels',hotelRouter);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});