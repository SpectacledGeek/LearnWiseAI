import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      "mongodb+srv://tanush1852:tanush1852@cluster4.imyvx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster4"
    );

    console.log("MongoDB connected");
  } catch (error) {
    console.log("MONGO Db connection error", error);
    process.exit(1);
  }
};

export default connectDB;
