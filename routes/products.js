import express from "express";
import { verifyTokenCreateProduct, verifyTokenProduct } from "../middleware/auth.js";
import { getProductById, updateProductByIdUsePUT, updateProductByIdUsePATCH, deleteProductById, createNewProduct } from "../controllers/products.js";
import uploadSingle from "../middleware/multer.js";
import { getImages, getImageById, postImage, deleteImageById } from "../controllers/image.js";


const router = express.Router();

router.route("/product/:id")
    .get(getProductById)
    .put(verifyTokenProduct, updateProductByIdUsePUT)
    .patch(verifyTokenProduct, updateProductByIdUsePATCH)
    .delete(verifyTokenProduct, deleteProductById)

router.post("/product", verifyTokenCreateProduct, createNewProduct);

router.route("/product/:id/image")
    .get(verifyTokenProduct, getImages)
    .post(verifyTokenProduct, uploadSingle, postImage);

router.route("/product/:id/image/:imageId")
    .get(verifyTokenProduct, getImageById)
    .delete(verifyTokenProduct, deleteImageById);

export default router