const dotenv = require('dotenv');

dotenv.config();

const config = {
  port: process.env.PORT ? Number(process.env.PORT) : 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/resume-screening',
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_key_here',
  pythonApiUrl: process.env.PYTHON_API_URL || 'http://localhost:5001',
  debug: process.env.NODE_ENV !== 'production'
};

const requiredEnv = ['MONGODB_URI', 'JWT_SECRET', 'PYTHON_API_URL'];
const missingEnv = requiredEnv.filter((key) => !process.env[key] && config.nodeEnv !== 'test');

if (missingEnv.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnv.join(', ')}. Add them to your .env file or configure them in the environment.`
  );
}

module.exports = config;
