import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log("MongoDB connection successful"));
        mongoose.connection.on('error', (err) => console.error('MongoDB connection error:', err));
        mongoose.connection.on('disconnected', () => console.log('MongoDB disconnected'));
        
        await mongoose.connect(`${process.env.MONGODB_URI}`);
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1); // Exit if DB connection fails
    }
}

export default connectDB;