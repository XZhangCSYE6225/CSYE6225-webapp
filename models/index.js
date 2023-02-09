import sequelize from "../config/index.js";
import Product from "./product.js";
import User from "./User.js";

export const user = sequelize.define('user', User, {
    createdAt: 'account_created',
    updatedAt: 'account_updated'
});
export const product = sequelize.define('product', Product, {
    createdAt: 'date_added',
    updatedAt: 'date_last_updated',

});