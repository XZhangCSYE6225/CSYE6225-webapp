import { Sequelize } from "sequelize";


const sequelize = new Sequelize("user_schema", "root", "zx991115", {
    host: "localhost",
    dialect: 'mysql'
})


export default sequelize