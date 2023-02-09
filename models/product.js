import { DataTypes } from "sequelize";
import sequelize from "../config/index.js";

const Product = {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    sku: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    manufacturer: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 0,
            max: 100
        }
    },
    owner_user_id: {
        type: DataTypes.INTEGER
    }

};
export const product = sequelize.define('product', Product, {
    createdAt: 'date_added',
    updatedAt: 'date_last_updated',

});