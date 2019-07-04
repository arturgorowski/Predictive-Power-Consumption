const config = {
    port: process.env.PORT,
    databaseUrl: process.env.MONGODB_URI,
    JwtSecret: process.env.JWT_SECRET
  };
  
  export default config;