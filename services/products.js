import { product } from '../models/index.js';

export async function getIdProduct(id) {
    const products = await product.findOne({
        where: {
            id: id
        }
    });
    return products;
}

export async function updateIdProduct(id, body) {    
    const updatedProduct = await product.update(body, {
        where: {
            id: id
        }
    });
    return updatedProduct;
}

export async function deleteProduct(id) {
    const deletedProduct = await product.destroy({
        where: {
            id: id
        }
    });
    return deletedProduct;
}

export async function createProduct(body) {
    const newproduct = await product.create(body);
    return newproduct;
}

export async function getSkuProduct(sku) {
    const skuuser = await product.findOne({
        where: {
            sku: sku
        }
    })
    return skuuser;
}