const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');
const colors = require('colors');
const cors = require('cors');
const PORT = process.env.PORT || 5000;


// Load env vars
dotenv.config({
    path: "./config/config.env"
});

// Connect to database
connectDB();

// Route files
const groups = require('./routes/groups');
const words = require('./routes/words');
const auth = require('./routes/auth');


const app = express();

// Body parser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// Enable CORS
app.use(cors());

// Mount routers
app.use("/api/v1/groups", groups);
app.use("/api/v1/words", words);
app.use("/api/v1/auth", auth);



app.use(errorHandler);


// const server = app.listen(PORT);
const server = app.listen(PORT, "192.168.1.128", console.log(`server up on ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
    console.log(`ErrorMAXMAX: ${err.message}`.red);
    // Close server and exit process
    server.close(() => process.exit(1));
});