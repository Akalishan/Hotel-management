import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import hotelRouter from "./routes/hotelRoutes.js";
import connectCloudinary from "./config/cloudinary.js";
import roomRouter from "./routes/roomRoute.js";
import bookingRouter from "./routes/bookingRoutes.js";
import cookieParser from "cookie-parser";

connectDB(); 
connectCloudinary();
const app = express();
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true
})); //Enable cross-Origin Resource Sharing

//middleware
app.use(express.json());


app.get("/", (req, res) => {
  res.send("API is working");
});
app.use('/api/user',userRouter);
app.use('/api/hotels',hotelRouter);
app.use('/api/rooms',roomRouter);
app.use("/api/bookings",bookingRouter);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});