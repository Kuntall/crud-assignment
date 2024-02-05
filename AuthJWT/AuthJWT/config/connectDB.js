import mongoose from "mongoose";

const connectDB = async (DATABASE_URL) => {
  try {
    const DB_CONFIG = {
      dbName: "user",
    };
    await mongoose.connect(DATABASE_URL, DB_CONFIG);
    console.log("Connection Successful to Database...");
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
