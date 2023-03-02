import { image } from "../models/image.js";

export async function getAllImages(id) {
    const imagesData = await image.findAll({
        where: {
            product_id: id
        }
    });
    return imagesData;
}

export async function isImageExist(path) {
    const imageData = await image.findOne({
        where: {
            s3_bucket_path: path
        }
    });
    return imageData;
}

export async function getOneImage(imageId) {
    const imageData = await image.findOne({
        where: {
            image_id: imageId
        }
    });
    return imageData;
}

export async function updateImage(imageId, body) {
    const updatedProduct = await product.update(body, {
        where: {
            image_id: imageId
        }
    });
    return updatedProduct;
}

export async function createImage(metadata) {
    const newImage = await image.create(metadata);
    return newImage
}

export async function deletedIdImage(imageId) {
    const deleteImage = await image.destroy({
        where: {
            image_id: imageId
        }
    })
    return deleteImage;
}