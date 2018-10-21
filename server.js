var express = require('express');
var bodyParser = require('body-parser');
var port = 80;
var app = express();
const currentVersion = 2.1;
var https = require('https');
var fs = require('fs');


app.use(express.static('./'));
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
app.listen(port, () => console.log(`Server started on ${port}\nVersion on server is ${currentVersion}`));
