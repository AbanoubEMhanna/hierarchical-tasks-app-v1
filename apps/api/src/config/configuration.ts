export default () => ({
  port: parseInt(process.env.PORT, 10) || 4000,
  DATABASE_URL: process.env.DATABASE_URL,
}); 
