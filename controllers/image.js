import logger from "../config/logger.js";
import { getOneImage, getAllImages, createImage, deletedIdImage, isImageExist } from "../services/images.js";
import { getIdProduct } from "../services/products.js"
import { uploadImage, deleteImage } from "../services/s3.js";
import statsdClient from "../config/statsd.js";

function logInfo(status, message, endpoint, method) {
    const information = {
        status: status,
        endpoint: endpoint,
        method: method
    }
    logger.info(information);
    logger.info(message);
}

function logError(status, message, endpoint, method) {
    const information = {
        status: status,
        endpoint: endpoint,
        method: method
    }
    logger.error(information);
    logger.error(message);
}

export const getImageById = async (req, res) => {
    
    const endpoint = `v1/product/${req.params.id}/image/${req.params.imageId}`
    const method = "GET"
    try {
        statsdClient.increment("Image.GET");
        const { imageId } = req.params
        const metadata = await getOneImage(imageId)
        if (metadata === null) {
            logError(404, { msg: "No such image" }, endpoint, method);
            return res.status(404).json();
        }
        if (metadata.product_id != req.params.id) {
            logError(403, { msg: "Forbidden" }, endpoint, method);
            return res.status(403).json();
        }
        logInfo(200, metadata, endpoint, method);
        res.status(200).json(metadata);
    } catch (error) {
        logError(400, error, endpoint, method);
        res.status(400).json();
    }

}

export const getImages = async (req, res) => {
    
    const endpoint = `v1/product/${req.params.id}/image`
    const method = "GET"
    try {
        statsdClient.increment("Images.GET");
        const metadata = await getAllImages(req.params.id);
        logInfo(200, metadata, endpoint, method);
        res.status(200).json(metadata);
    } catch (error) {
        logError(400, error, endpoint, method);
        res.status(400).json();
    }
}

export const postImage = async (req, res) => {
    const endpoint = `/v1/product/${req.params.id}/image`;
    const method = "POST";
    try {
        statsdClient.increment("Image.POST");
        if (req.file.mimetype.split("/")[0] !== "image") {
            logError(400, { msg: `Type ${req.file.mimetype} is not image` }, endpoint, method);
            return res.status(400).json();
        }
        const { id } = await getIdProduct(req.params.id);
        const bucket_path = `${id}/${req.file.originalname}`;
        const isExist = await isImageExist(bucket_path);
        let fileName = req.file.originalname;
        let metadata = {
            product_id: req.params.id,
            file_name: req.file.originalname,
            s3_bucket_path: bucket_path
        }
        if (isExist !== null) {
            let subString = fileName.split(".");
            subString[subString.length - 2] += Date.now().toString();
            metadata.file_name = subString.join(".");
            metadata.s3_bucket_path = `${id}/${metadata.file_name}`;
        }
        const result = await uploadImage(req.file.buffer, metadata.s3_bucket_path, req.file.mimetype);
        const newImage = await createImage(metadata);
        logInfo(201, newImage, endpoint, method);
        res.status(201).json(newImage);
    } catch (error) {
        logError(400, error, endpoint, method);
        res.status(400).json();
    }
}

export const deleteImageById = async (req, res) => {
    const endpoint = `/v1/product/${req.params.id}/image/${req.params.imageId}`;
    const method = "DELETE";
    try {
        statsdClient.increment("Image.DELETE");
        const { imageId } = req.params
        const metadata = await getOneImage(imageId)
        if (metadata === null) {
            logError(404, { msg: "Image not exist" }, endpoint, method);
            return res.status(404).json();
        }
        if (metadata.product_id != req.params.id) {
            logError(403, { msg: "Not authorized" }, endpoint, method);
            return res.status(403).json();
        }
        const file = await deleteImage(metadata.s3_bucket_path);
        await deletedIdImage(imageId);
        logInfo(204, { msg: "Delete success" }, endpoint, method);
        res.status(204).json();

    } catch (error) {
        logError(400, error, endpoint, method);
        res.status(400).json({ msg: error });
    }
}