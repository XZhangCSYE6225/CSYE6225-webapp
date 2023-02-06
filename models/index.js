import sequelize from "../config/index.js";
import Product from "./product.js";
import User from "./User.js";

sequelize.define('user', User, {
    createdAt: 'account_created',
    updatedAt: 'account_updated'
});
sequelize.define('product', Product, {
    createdAt: 'date_added',
    updatedAt: 'date_last_updated',

});

export default sequelize