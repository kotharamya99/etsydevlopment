import multer from 'multer';
import path from 'path';
//Cloud Storage 
import aws from 'aws-sdk'
import crypto from 'crypto'
import { promisify } from "util"
const randomBytes = promisify(crypto.randomBytes)

async function getSecureUrl(req, res) 
{

    const region = "us-east-1"
    const bucketName = "etsyawsbucket"
    const accessKeyId = "AKIAZP3IZBQZ64SFMM6J"
    const secretAccessKey = "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"
    

    const s3 = new aws.S3({
    region,
    accessKeyId,
    secretAccessKey,
    signatureVersion: 'v4'
    })

    const rawBytes = await randomBytes(16)
    const imageName = rawBytes.toString('hex')
    const params = ({
        Bucket: bucketName,
        Key: imageName,
        Expires: 300
    })
    const uploadURL = await s3.getSignedUrlPromise('putObject', params)
    console.log("URL ----"+uploadURL);
    res.send({uploadURL})
}


let endpoints = {
    '/s3url': [{
        method: 'GET',
        callbacks: [getSecureUrl]
    }]
}

// Server storage
// import { fileURLToPath } from 'url';
// const __filename = fileURLToPath(
//     import.meta.url);
// const __dirname = path.dirname(__filename);
// //var baseUrl = "https://sharansantosh-etsyprototype.herokuapp.com"
// var baseUrl = "http://localhost:3001";
// let fileName;
// const storage = multer.diskStorage({
//     destination: __dirname + "/../../public/uploads/",
//     filename: function(req, file, cb) {
//         fileName = "IMAGE-" + Date.now() + path.extname(file.originalname);
//         cb(null, fileName);
//     }
// });

// const uploadFile = multer({
//     storage: storage,
//     limits: { fileSize: 10000000 },
// }).single("myImage");

// function upload(req, res) {
//     uploadFile(req, res, (err) => {
//         if (!err) {
//             return res.status(200).json({
//                 imageUrl: `${baseUrl}/file/${fileName}`
//             });
//         }
//     });
// }

// function getFile(req, res) {
//     const filePath = `${__dirname}/../../public/uploads/${req.params.fileName}`; // find out the filePath based on given fileName
//     // res.sendFile(filePath);
//     res.sendFile(path.resolve(filePath));

// }

// let endpoints = {
//     '/upload': [{
//         method: 'POST',
//         callbacks: [upload] // last index function is always a rest function
//     }],
//     '/file/:fileName': [{
//         method: 'GET',
//         callbacks: [getFile]
//     }]
// }

export { endpoints }