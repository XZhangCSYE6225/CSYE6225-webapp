import { getIdProduct, updateIdProduct, deleteProduct, createProduct, getSkuProduct } from "../services/products.js";

export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await getIdProduct(id);
        if (!product) {
            return res.status(404).json();
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(400).json({ msg: error });
    }
}

export const createNewProduct = async (req, res) => {
    try {
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
            return res.status(400).json();
        }
        if (name === undefined || description === undefined || sku === undefined || manufacturer === undefined) {
            return res.status(400).json();
        }
        if (id || owner_user_id || date_added || date_last_updated) {
            return res.status(400).json();
        }
        if (await getSkuProduct(sku)) {
            return res.status(400).json();
        }
        req.body.owner_user_id = req.body.owner_id;
        const createdproduct = await createProduct(req.body);
        res.status(201).json(createdproduct);
    } catch (error) {
        res.status(400).json({ msg: error });
    }
}

export const updateProductByIdUsePUT = async (req, res) => {
    try {
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
            return res.status(400).json();
        }
        if (name === undefined || description === undefined || sku === undefined || manufacturer === undefined) {
            return res.status(400).json();
        }
        if (id || owner_user_id || date_added || date_last_updated) {
            return res.status(400).json();
        }
        const skuUser = await getSkuProduct(sku);
        if (skuUser) {
            console.log(skuUser.id, req.params.id);
            if (skuUser.id != req.params.id){
                return res.status(400).json({});
            }
        }
        const updatedproduct = await updateIdProduct(req.params.id, req.body);
        res.status(204).json(updatedproduct);
    } catch (error) {
        res.status(400).json();
    }
}

export const updateProductByIdUsePATCH = async (req, res) => {
    try {
        const {
            id,
            owner_user_id,
            date_added,
            date_last_updated
        } = req.body;
        if ( req.body.quantity !== undefined && typeof(req.body.quantity) === "string" ) {
            return res.status(400).json();
        }
        if (id || owner_user_id || date_added || date_last_updated) {
            return res.status(400).json();
        }
        if (req.body.sku !== undefined) {
            const skuUser = await getSkuProduct(req.body.sku);
            if (skuUser) {
                if ( skuUser.id != req.params.id ) {
                    return res.status(400).json();
                }
            }
        }
        const updatedproduct = await updateIdProduct(req.params.id, req.body);
        res.status(204).json(updatedproduct);
    } catch (error) {
        res.status(400).json();
    }
}

export const deleteProductById = async (req, res) => {
    try {
        const updatedproduct = await deleteProduct(req.params.id, req.body);
        res.status(204).json();
    } catch (error) {
        res.status(400).json();
    }
}