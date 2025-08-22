import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on('connected', () => 
      console.log("MongoDB connection successful")); 
    await mongoose.connect(`${process.env.MONGODB_URI}`);
  } catch (error) {
    console.log("MongoDB connection failed");
    console.error( error.message);
  }
}

export default connectDB;