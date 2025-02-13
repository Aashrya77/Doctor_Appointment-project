require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const port = process.env.PORT || 5500
const app = express();
const connectDb = require('./db/connectDb');
const userRouter = require('./routes/User');
const appointmentRouter = require('./routes/Appointments');
const availabilityRouter = require('./routes/DoctorAvailablity');

// Security middleware
app.use(helmet()); // Sets various HTTP headers for security
app.use(cors()); // Enables Cross-Origin Resource Sharing
app.use(express.json()); // Parses incoming JSON requests
app.use(mongoSanitize()); // Prevents NoSQL injection
app.use(xss()); // Prevents XSS attacks

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, 
    max: 100, // Max requests per window
    message: "Too many requests from this IP, please try again later."
});
app.use(limiter)

// Routes
app.use('/api/v1', userRouter);
app.use('/api/v1', appointmentRouter);
app.use('/api/v1', availabilityRouter);

const startServer = async () => {
    try { 
        await connectDb(process.env.MONGO_URI);
        app.listen(port, () => {
            console.log(`Server is running on port ${port}...`);
        });
    } catch (error) {
        console.log(error);
    }
};

startServer();
