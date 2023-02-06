import sequelize from '../models/index.js'

export async function getIdProduct(id) {
    const product = await sequelize.models.product.findOne({
        where: {
            id: id
        }
    });
    return product;
}

export async function updateIdProduct(id, body) {    
    const updatedProduct = await sequelize.models.product.update(body, {
        where: {
            id: id
        }
    });
    return updatedProduct;
}

export async function deleteProduct(id) {
    const deletedProduct = await sequelize.models.product.destroy({
        where: {
            id: id
        }
    });
    return deletedProduct;
}

export async function createProduct(body) {
    const newproduct = await sequelize.models.product.create(body);
    return newproduct;
}