const express = require('express');
const bodyParser = require('body-parser');
const UploadAPI = require('./api/uploadfile');
const GetFileAPI = require('./api/downloadfile');

const PORT = 3000;

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.get('/',function(req,res){
    res.sendFile(__dirname + '/client/index.html');
});

app.use('/api', UploadAPI);
app.use('/api', GetFileAPI);


app.listen(process.env.APP_PORT || PORT, () => console.log('Server started in port', PORT));