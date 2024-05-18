import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import logService from './middlewares/logService.js';
import colors from 'colors';
import morgan from 'morgan';
import sequelize from './config/database.js';
import { startDatabase } from './utils/start-database.js';
import userRoutes from './routes/userRoutes.js';
import dotorRoutes from './routes/doctorRoutes.js'
import adminRoutes from './routes/adminRoutes.js'

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Custom middleware
app.use((req, res, next) => {
  logService.log(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/doctor',dotorRoutes);
app.use('/api/v1/admin',adminRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  logService.error("Server error", err);
  console.error(err.stack);
  res.status(500).send("Some error occurred!");
});

// Start server
const PORT = process.env.PORT || 8080;

startDatabase(sequelize)
 .then(() => {
    app.listen(PORT, () => {
      logService.log(`Server Running in ${process.env.NODE_MODE} Mode on Port ${PORT}`.bgCyan.white); 
    });
  })
 .catch((err) => {
    logService.error("Failed to start the server", err);
    console.error("Failed to start the server:", err);
  });

export default app;