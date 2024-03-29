import { Sequelize } from "sequelize";
import dotenv from 'dotenv';
import logger from "./logger.js";
dotenv.config();
const {
    DATABASE_HOST,
    DATABASE_NAME,
    DATABASE_USERNAME,
    DATABASE_PASSWORD,
    DIALECT
} = process.env;
const sequelize = new Sequelize(DATABASE_NAME, DATABASE_USERNAME, DATABASE_PASSWORD, {
    host: DATABASE_HOST,
    dialect: DIALECT,
    logging: msg => logger.info(msg)
})


export default sequelize