const express = require('express')
const router = express.Router()
const minioClient = require('./../config/minioclient');

router.get('/download/:filename', (req, res) => {
    console.log('File download', req.params.filename);
    minioClient.getObject('krish', req.params.filename, (err, stream) => {
        if(err) {
            return res.status(500).json(err);
        }
        stream.pipe(res);
    });
});

module.exports = router;