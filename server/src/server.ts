import app from './app.js';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';

const startServer = async () => {
  await connectDB();

  app.listen(env.PORT, () => {
    console.log(`Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
    console.log(`API Health Check: http://localhost:${env.PORT}/api/health`);
  });
};

startServer().catch((error) => {
  console.error('Fatal error starting server:', error);
  process.exit(1);
});
