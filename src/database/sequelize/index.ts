import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(process.env.POSTGRES_DATABASE_URL as string, {
  dialect: "postgres",
});

export default sequelize;