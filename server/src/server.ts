import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './config/db.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    console.log(`API Health Check: http://localhost:${PORT}/api/health`);
  });
};

startServer().catch((error) => {
  console.error('Fatal error starting server:', error);
  process.exit(1);
});
