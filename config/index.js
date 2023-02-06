import Sequelize from "sequelize";

const {
    DATABASE_NAME = "user_schema",
    DATABASE_USERNAME = "root",
    DATABASE_PASSWORD = "zx991115",
    DIALECT = "mysql"
} = process.env

const sequelize = new Sequelize("user_schema", "root", "zx991115", {
    host: "localhost",
    dialect: DIALECT
})


export default sequelize