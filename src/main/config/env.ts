export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/clean-node-api',
  port: process.env.PORT || 50550,
  jwtSecret: process.env.JWT_SECRET || 'dsa21hu!@34123'
}
