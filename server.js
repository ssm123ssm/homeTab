var express = require('express');
var bodyParser = require('body-parser');
var port = 8080;
var app = express();
const currentVersion = 2.11;
var https = require('https');
var fs = require('fs');


app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json({
    limit: '50mb'
})); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    limit: '50mb',
    extended: true
}));

const blobFolder = './res/blobs/';
var blobArray = [];

fs.readdirSync(blobFolder).forEach(file => {
    blobArray.push(file);
});

app.get('/bobnames', function (req, res) {
    res.send({
        blobnames: blobArray
    });
});


app.post('/connect', function (req, res) {
    var uptodate = false;
    if (Number.parseFloat(req.body.version) == currentVersion) {
        uptodate = true;
    }
    res.send({
        currentVersion: currentVersion,
        uptodate: uptodate
    });
});


var key = fs.readFileSync('ssl_cert/example.key');
var cert = fs.readFileSync('ssl_cert/example.crt');
var options = {
    key: key,
    cert: cert
};
app.listen(port, () => console.log(`Server started on ${port}\nVersion on server is ${currentVersion}`));
//https.createServer(options, app).listen(443);
