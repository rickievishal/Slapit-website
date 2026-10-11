import app from './app';
import { connectDB } from './config/db';
import { env } from './config/env';

const start = async () => {
  await connectDB();

  app.listen(env.PORT, () => {
    console.log(`🚀 SLAP IT Server listening on http://localhost:${env.PORT}`);
    console.log(`📡 CORS allowed for: ${env.CLIENT_URL}`);
  });
};

start();
