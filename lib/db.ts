import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
  const connectToDB = async () => {
    if (mongoose.connection.readyState === 1) {
        console.log("Already connected to DB");
        return;
    }    
    try {
        await mongoose.connect(MONGODB_URI!);
        console.log("Connected to DB");
    } catch (error) {
        console.error("Database connection error:", error);
    }
};

export default connectToDB;