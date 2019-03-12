const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const uuid = require('uuid');
const fs = require('fs');
const events = require('events');
const Minio = require('minio')
const hash = require('object-hash');

const minioFileDumpEvent = new events.EventEmitter();

const minioClient = new Minio.Client({
    endPoint: 'play.minio.io',
    port: 9000,
    useSSL: true,
    accessKey: 'Q3AM3UQ867SPQQA43P2F',
    secretKey: 'zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG'
});

const fileDumpListener = (param, metadata) => {
    console.log('Move the file now', metadata);
    const filePath = param.path
    const filename = hash.sha1(metadata);
    console.log('File stored by name', filename);
    minioClient.fPutObject('krish', filename, filePath, metadata, (err, etag) => {
        if (err) return console.log(err)
        console.log('File uploaded successfully.')
        fs.unlinkSync(filePath);
        console.log('Deleted file');
      });
}
const app = express();
app.use(bodyParser.urlencoded({extended: true}));

// SET STORAGE
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }    
})
   
const upload = multer({ storage: storage });
minioFileDumpEvent.on('file_dumped', fileDumpListener);

app.get('/',function(req,res){
    res.sendFile(__dirname + '/index.html');
});

app.get('/file/:filename', (req, res) => {
    console.log(req.params.filename);
    targetfilePath = 'uploads/Machine Learning with TensorFlow.pdf'
    minioClient.fGetObject('krish', req.params.filename, targetfilePath, (err) => {
        if (err) {
          res.json(err);
        }
        res.json({message: 'Good, All is well. Downloaded'})
      });
})

app.get('/download/:filename', (req, res) => {
    console.log('File download', req.params.filename);
    minioClient.getObject('krish', req.params.filename, (err, stream) => {
        if(err) {
            return res.status(500).json(err);
        }
        stream.pipe(res);
    });
});

app.post('/uploadfile', upload.single('myfile'), (req, res, next) => {
    const file = req.file;
    //TODO: pass metadata as a part of body
    
    if(!file) {
        const error = new Error("Please upload file");
        error.httpStatusCode = 400;
        return next(error);
    }
    //TODO: Possibly convert to async
    const metadata = {requestedBy: 'sriramk@grangeinsurance.com', firstName:'Krishnan', lastName: 'Sriram'}
    minioFileDumpEvent.emit('file_dumped', file, metadata);
    res.send(file);
});

app.listen(3000, () => console.log('Server started in port 3000'));