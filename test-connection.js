const { Sequelize } = require("sequelize");
require("dotenv").config();

console.log("🔍 Environment variables:");
console.log("DB_NAME:", process.env.DB_NAME);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD ? "***SET***" : "***NOT SET***");
console.log("DB_HOST:", process.env.DB_HOST);

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: console.log, // This will show SQL queries and connection details
  }
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connection has been established successfully.");
  } catch (error) {
    console.error("❌ Unable to connect to the database:");
    console.error("Full error:", error);
    console.error("Error message:", error.message);
    console.error("Error code:", error.code);
    console.error("Error errno:", error.errno);
  } finally {
    await sequelize.close();
  }
})();