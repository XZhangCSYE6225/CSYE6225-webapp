import { Sequelize } from "sequelize";
import dotenv from 'dotenv';
dotenv.config();
const {
    DATABASE_NAME = "user_schema",
    DATABASE_USERNAME = "root",
    DATABASE_PASSWORD = "zx991115",
    DIALECT = "mysql"
} = process.env;
const sequelize = new Sequelize(DATABASE_NAME, DATABASE_USERNAME, DATABASE_PASSWORD, {
    dialect: DIALECT
})


export default sequelize