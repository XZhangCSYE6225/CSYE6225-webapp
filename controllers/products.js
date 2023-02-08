import { getIdProduct, updateIdProduct, deleteProduct, createProduct } from "../services/products.js";

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
        if (!name || !description || !sku || !manufacturer || !quantity) {
            return res.status(400).json({ msg: "User should enter all name, description, sku, manufacturer and quantity"});
        }
        if (id || owner_user_id || date_added || date_last_updated) {
            return res.status(400).json({ msg: "User should not enter id, owner_user_id, date_added and date_last_updated"});
        }
        req.body.owner_user_id = req.body.owner_id;
        if (quantity < 0 || Math.floor(quantity) !== quantity) {
            return res.status(400).json({ msg: "Product quantity must be"});
        }
        const createdproduct = await createProduct(req.body);
        res.status(201).json(createdproduct);
    } catch (error) {
        res.status(400).json({ msg: error });
    }
}

export const updateProductById = async (req, res) => {
    try {
        const {
            id,
            owner_user_id,
            date_added,
            date_last_updated
        } = req.body;
        if (id || owner_user_id || date_added || date_last_updated) {
            return res.status(400).json({ msg: "User should not enter id, owner_user_id, date_added and date_last_updated"});
        }
        if (req.body.quantity && req.body.quantity < 0) {
            return res.status(400).json({ msg: "Product quantity cannot be less than 0."});
        }
        const updatedproduct = await updateIdProduct(req.params.id, req.body);
        res.status(204).json(updatedproduct);
    } catch (error) {
        res.status(400).json({ msg: error });
    }
}

export const deleteProductById = async (req, res) => {
    try {
        const deletedproduct = await deleteProduct(req.params.id, req.body);
        res.status(204).json({ msg: "Successfully deleted" });
    } catch (error) {
        res.status(400).json({ msg: error });
    }
}