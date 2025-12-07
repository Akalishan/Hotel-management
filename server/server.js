import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import hotelRouter from "./routes/hotelRoutes.js";
import roomRouter from "./routes/roomRoute.js";
import bookingRouter from "./routes/bookingRoutes.js";
import cookieParser from "cookie-parser";
import experienceRouter from "./routes/experienceRoutes.js";

connectDB(); 
const app = express();
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
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
app.use("/api/experiences", experienceRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});