import mongoose from "mongoose";
const mongoURI = 'mongodb+srv://tanush1852:tanush1852@cluster4.imyvx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster4';

const mongoDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB successfully');

    // Fetching the 'food_items' collection
    const db = mongoose.connection.db;
    
    
  } catch (err) {
    console.error('Error connecting to MongoDB or fetching data:', err);
    process.exit(1); // Exit the app if there is a connection error
  }
};

export default mongoDB;
