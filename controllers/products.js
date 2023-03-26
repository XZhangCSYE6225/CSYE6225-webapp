import { getIdProduct, updateIdProduct, deleteProduct, createProduct, getSkuProduct } from "../services/products.js";
import { deletedIdImage, getAllImages } from "../services/images.js";
import { deleteImage } from "../services/s3.js";
import logger from "../config/logger.js";
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

export const getProductById = async (req, res) => {
    const endpoint = `/v1/product/${req.params.id}`;
    const method = "GET"
    try {
        statsdClient.increment("Product.GET");
        const { id } = req.params;
        const product = await getIdProduct(id);
        if (!product) {
            logError(404, { msg: "Product not found"}, endpoint, method);
            return res.status(404).json();
        }
        logInfo(200, product, endpoint, method);
        res.status(200).json(product);
    } catch (error) {
        logError(400, error, endpoint, method);
        res.status(400).json({ msg: error });
    }
}

export const createNewProduct = async (req, res) => {
    const endpoint = "/v1/product"
    const method = "POST"
    try {
        statsdClient.increment("Product.POST");
        const {
            id,
            name,
            description,
            sku,
            manufacturer,
            quantity,
            owner_user_id,
            date_added,
            date_last_updated
        } = req.body;
        if (Math.floor(quantity) !== quantity || quantity < 0 || quantity === undefined) {
            logError(400, { msg: "Quantity invalid"}, endpoint, method);
            return res.status(400).json();
        }
        if (name === undefined || description === undefined || sku === undefined || manufacturer === undefined) {
            logError(400, { msg: "Information incomplete"}, endpoint, method);
            return res.status(400).json();
        }
        if (id || owner_user_id || date_added || date_last_updated) {
            logError(400, { msg: "Invalid input"}, endpoint, method);
            return res.status(400).json();
        }
        if (await getSkuProduct(sku)) {
            logError(400, { msg: "SKU already exist"}, endpoint, method);
            return res.status(400).json();
        }
        req.body.owner_user_id = req.body.owner_id;
        const createdProduct = await createProduct(req.body);
        logInfo(201, createdProduct, endpoint, method)
        res.status(201).json(createdProduct);
    } catch (error) {
        logError(400, error, endpoint, method);
        res.status(400).json({ msg: error });
    }
}

export const updateProductByIdUsePUT = async (req, res) => {
    const endpoint = `/v1/product/${req.params.id}`;
    const method = "PUT";
    try {
        statsdClient.increment("Product.PUT");
        const {
            id,
            name,
            description,
            sku,
            manufacturer,
            quantity,
            owner_user_id,
            date_added,
            date_last_updated
        } = req.body;
        if (Math.floor(quantity) !== quantity || quantity < 0 || quantity === undefined || typeof(quantity) === "string") {
            logError(400, { msg: "Quantity invalid"}, endpoint, method);
            return res.status(400).json();
        }
        if (name === undefined || description === undefined || sku === undefined || manufacturer === undefined) {
            logError(400, { msg: "Information incomplete"}, endpoint, method);
            return res.status(400).json();
        }
        if (id || owner_user_id || date_added || date_last_updated) {
            logError(400, { msg: "Not allowed to update"}, endpoint, method);
            return res.status(400).json();
        }
        const skuUser = await getSkuProduct(sku);
        if (skuUser) {
            if (skuUser.id != req.params.id){
                logError(400, { msg: "SKU already exist"}, endpoint, method);
                return res.status(400).json({});
            }
        }
        if (req.body.quantity && req.body.quantity < 0) {
            logError(400, { msg: "Product quantity cannot be less than 0"}, endpoint, method);
            return res.status(400).json({ msg: "Product quantity cannot be less than 0"});
        }
        const updatedProduct = await updateIdProduct(req.params.id, req.body);
        logInfo(204, updatedProduct, endpoint, method);
        res.status(204).json(updatedProduct);
    } catch (error) {
        logError(400, error, endpoint, method);
        res.status(400).json({ msg: error });
    }
}

export const updateProductByIdUsePATCH = async (req, res) => {
    const endpoint = `/v1/product/${req.params.id}`;
    const method = "PATCH";
    try {
        statsdClient.increment("Product.PATCH");
        const {
            id,
            owner_user_id,
            date_added,
            date_last_updated
        } = req.body;
        if ( req.body.quantity !== undefined && typeof(req.body.quantity) === "string" ) {
            logError(400, { msg: "Quantity invalid"}, endpoint, method);
            return res.status(400).json();
        }
        if (id || owner_user_id || date_added || date_last_updated) {
            logError(400, { msg: "Not allowed to update"}, endpoint, method);
            return res.status(400).json();
        }
        if (req.body.sku !== undefined) {
            const skuUser = await getSkuProduct(req.body.sku);
            if (skuUser) {
                if ( skuUser.id != req.params.id ) {
                    logError(400, { msg: "SKU already exist"}, endpoint, method);
                    return res.status(400).json();
                }
            }
        }
        const updatedproduct = await updateIdProduct(req.params.id, req.body);
        logInfo(204, updatedproduct, endpoint, method);
        res.status(204).json(updatedproduct);
    } catch (error) {
        logError(400, error, endpoint, method);
        res.status(400).json({ msg: error });
    }
}

export const deleteProductById = async (req, res) => {
    const endpoint = `/v1/product/${req.params.id}`;
    const method = "DELETE";
    try {
        statsdClient.increment("Product.DELETE");
        const allimages = await getAllImages(req.params.id);
        allimages.forEach(async image => {
            await deleteImage(image.s3_bucket_path);
            await deletedIdImage(image.image_id);
        });
        const updatedproduct = await deleteProduct(req.params.id, req.body);
        logInfo(204, updatedproduct, endpoint, method);
        res.status(204).json();
    } catch (error) {
        logError(400, error, endpoint, method);
        res.status(400).json({ msg: error });
    }
}