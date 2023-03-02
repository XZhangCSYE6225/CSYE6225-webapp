import { Sequelize } from "sequelize";
import dotenv from 'dotenv';
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
    dialect: DIALECT
})


export default sequelize