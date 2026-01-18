import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();
// Loads the variables defined inside of the .env file into the computer's memory which can now be accessed inside the application
// Industry standard to place this line at the very top before the application is even created

// const mongoCompassDB = mongoose.createConnection(process.env.MONGO_URI)
// mongoCompassDB.on('connected', () => console.log("MongoDB Compass Connected!"))
// mongoCompassDB.on('error', () => console.log("MongoDB Compass Connected!"))
// I no longer need access to this local database so can delete this code block 

// Create the connection and export it
export const atlasDB = mongoose.createConnection(process.env.MONGO_ATLAS_URI);
atlasDB.on('connected', () => console.log("MongoDB Atlas Connected!"));
atlasDB.on('error', (err) => console.error("❌ MongoDB Connection Error:", err));