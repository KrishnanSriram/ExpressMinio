const Minio = require('minio')
require('dotenv').config()

const minioClient = new Minio.Client({
    endPoint: process.env.ENDPOINT,
    port: parseInt(process.env.PORT),
    useSSL:  true,
    accessKey: process.env.ACCESS_KEY,
    secretKey: process.env.SECRET_KEY
});

module.exports = minioClient;