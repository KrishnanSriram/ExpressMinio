const express = require('express')
const router = express.Router();
const minioClient = require('./../config/minioclient');
const uploadConfig = require('./config/multerConfig');
const path = require('path');
const fs = require('fs');
const events = require('events');
const fileDumpListener = require('./config/filedump');
//TODO: Move this out of here, or change it to async process
const minioFileDumpEvent = new events.EventEmitter();


minioFileDumpEvent.on('file_dumped', fileDumpListener);

router.get('/uploadfile', (req, res) => res.json({message:'Do POST on this API, GET is not supported'}));

router.post('/uploadfile', uploadConfig.single('myfile'), (req, res, next) => {
    const file = req.file;
    //TODO: pass metadata as a part of body
    
    if(!file) {
        const error = new Error("Please upload file");
        error.httpStatusCode = 400;
        return next(error);
    }
    //TODO: Possibly convert to async
    const metadata = {requestedBy: 'sriramk@grangeinsurance.com', firstName:'Krishnan', lastName: 'Sriram'}
    minioFileDumpEvent.emit('file_dumped', file, metadata, minioClient);
    res.send(file);
});

module.exports = router;