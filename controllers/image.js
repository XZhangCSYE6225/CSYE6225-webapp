import { getOneImage, getAllImages, createImage, deletedIdImage, isImageExist } from "../services/images.js";
import { getIdProduct } from "../services/products.js"
import { uploadImage, deleteImage } from "../services/s3.js";

export const getImageById = async (req, res) => {
    try {
        const { imageId } = req.params
        const metadata = await getOneImage(imageId)
        if (metadata === null) {
            return res.status(404).json();
        }
        if (metadata.product_id != req.params.id) {
            return res.status(403).json();
        }
        res.status(200).json(metadata);
    } catch (error) {
        res.status(400).json({ msg: error });
    }

}

export const getImages = async (req, res) => {
    try {
        const metadata = await getAllImages(req.params.id);
        res.status(200).json(metadata);
    } catch (error) {
        res.status(400).json({ msg: error });
    }
}

export const postImage = async (req, res) => {
    try {
        const { id } = await getIdProduct(req.params.id);
        const bucket_path = `${id}/${req.file.originalname}`;
        const isExist = await isImageExist(bucket_path)
        const metadata = {
            product_id: req.params.id,
            file_name: req.file.originalname,
            s3_bucket_path: bucket_path
        }
        const result = await uploadImage(req.file.buffer, bucket_path, req.file.mimetype);
        if (isExist !== null) {
            
        }
        else {
            const newImage = await createImage(metadata);
            res.status(201).json(newImage);
        }
    } catch (error) {
        res.status(400).json({ msg: error });
    }
}

export const deleteImageById = async (req, res) => {
    try {
        const { imageId } = req.params
        const metadata = await getOneImage(imageId)
        if (metadata === null) {
            return res.status(404).json();
        }
        if (metadata.product_id != req.params.id) {
            return res.status(403).json();
        }
        const file = await deleteImage(metadata.s3_bucket_path);
        await deletedIdImage(imageId);
        res.status(204).json();

    } catch (error) {
        res.status(400).json({ msg: error });
    }
}