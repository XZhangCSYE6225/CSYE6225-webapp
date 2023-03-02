import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";

const Image = {
    image_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    file_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    s3_bucket_path: {
        type: DataTypes.STRING,
        allowNull: false
    }

};
export const image = sequelize.define('image', Image, {
    createdAt: false,
    updatedAt: 'date_updated',

});