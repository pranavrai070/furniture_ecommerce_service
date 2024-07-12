// const Product = require('../models/productModel');
// const {Upload} =require('../middlewares/uploadMiddleware');
require('dotenv').config();
const fs = require('fs');
const multiparty = require('multiparty');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const mime = require('mime-types');
const Product = require('../models/productModel'); // Adjust the path as necessary
 // Ensure environment variables are loaded

 const bucketName = process.env.S3_BUCKET_NAME;

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const createProduct = async (req, res) => {
    const form = new multiparty.Form();
    form.parse(req, async (err, fields, files) => {
        if (err) return res.status(400).json({ error: err.message });

        try {
            const { name, description, price, stock, ratings, reviews, sizes, colors } = fields;

            // Collect the image URLs from the uploaded files
            const links = [];
            for (const file of files.images) { // Assuming 'images' is the field name
                const ext = file.originalFilename.split('.').pop();
                const newFilename = Date.now() + '.' + ext;
                const fileContent = fs.readFileSync(file.path);

                await s3Client.send(new PutObjectCommand({
                    Bucket: bucketName,
                    Key: newFilename,
                    Body: fileContent,
                    ACL: 'public-read',
                    ContentType: mime.lookup(file.path),
                }));

                const link = `https://${bucketName}.s3.amazonaws.com/${newFilename}`;
                links.push(link);
            }

            const newProduct = new Product({
                name: name[0],
                description: description[0].split(','), // Convert comma-separated string to array
                price: parseFloat(price[0]),
                stock: parseInt(stock[0], 10),
                images: links, // Store the image URLs
                ratings: ratings ? parseFloat(ratings[0]) : 0,
                reviews: reviews ? JSON.parse(reviews[0]) : [],
                sizes: sizes ? sizes[0].split(',') : [], // Convert comma-separated string to array
                colors: colors ? colors[0].split(',') : [] // Convert comma-separated string to array
            });

            await newProduct.save();
            res.status(201).json(newProduct);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    });
};



module.exports={
    getProducts,
    createProduct
}
