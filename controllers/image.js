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
        if (req.file.mimetype.split("/")[0] !== "image") {
            return res.status(400).json({ type:req.file.mimetype });
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
        res.status(201).json(newImage);
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