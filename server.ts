import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import colors from "colors";
import 
{ errorHandler } from "./middleware/error";
import cookieParser from "cookie-parser";

import connectDB from "./config/db";

//Load env vars
dotenv.config({ path: "./config/config.env" });

// connect to the database
connectDB();

// Route files
import { auth } from "./routes/auth";

// Initialize app
const app = express();

// Body parser
app.use(express.json());

//Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Mount routers
app.use("/api/v1/auth", auth);

app.use(errorHandler);

const PORT = process.env.PORT || 6000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

// Handle unhandled promise rejection
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server and exit process
  server.close(() => process.exit(1));
});
