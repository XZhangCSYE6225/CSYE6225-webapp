import { S3Client } from "@aws-sdk/client-s3";

const {
    AWS_BUCKET_REGION
} = process.env

const s3client = new S3Client({
    region: AWS_BUCKET_REGION
})

export default s3client