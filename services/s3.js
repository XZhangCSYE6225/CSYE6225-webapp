import s3client from "../config/s3.js";
import dotenv from "dotenv";
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

dotenv.config();

export async function uploadImage(imageBuffer, fileName, mimetype) {
    try {
        const uploadParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Body: imageBuffer,
            Key: fileName,
            ContentType: mimetype
        }
        const file = await s3client.send(new PutObjectCommand(uploadParams));
        return file
    } catch (error) {
        console.log(error)
    }
}

export async function deleteImage(fileName) {
    try {
        const deleteParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileName
        }
        const file = await s3client.send(new DeleteObjectCommand(deleteParams));
        return file
    } catch (error) {
        console.log(error);
    }
}

export async function getObjectSignedUrl(key) {
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key
    };
    const command = new GetObjectCommand(params);
    const url = await getSignedUrl(s3client, command, { expiresIn: 60 });
    return url
}