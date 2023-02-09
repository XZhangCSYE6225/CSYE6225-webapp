import express from "express";
import { verifyTokenCreateProduct, verifyTokenProduct } from "../middleware/auth.js";
import { getProductById, updateProductByIdUsePUT, updateProductByIdUsePATCH, deleteProductById, createNewProduct } from "../controllers/products.js";


const router = express.Router();

router.route("/product/:id")
    .get(getProductById)
    .put(verifyTokenProduct, updateProductByIdUsePUT)
    .patch(verifyTokenProduct, updateProductByIdUsePATCH)
    .delete(verifyTokenProduct, deleteProductById)

router.post("/product", verifyTokenCreateProduct, createNewProduct);


export default router