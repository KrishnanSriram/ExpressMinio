const hash = require('object-hash');
const fs = require('fs');

const fileDumpListener = (param, metadata, minioClient) => {
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

module.exports = fileDumpListener;