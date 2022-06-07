import { Sequelize } from "sequelize";

// Define the constants
const DATABASE = process.env.DATABASE || "";
const USERNAME = process.env.DB_USERNAME || "";
const PASSWORD = process.env.DB_PASSWORD || "";
const HOST = process.env.DB_HOST || "";

// sequelize connection to mysql
const sequelize = new Sequelize(DATABASE, USERNAME, PASSWORD, {
  host: HOST,
  dialect: "mysql",
  logging: false,
  define: {
    timestamps: false,
  },
});


export { sequelize };
