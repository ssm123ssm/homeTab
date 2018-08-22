var express = require('express');
var bodyParser = require('body-parser');
var port = 80;
var app = express();


app.use(express.static('./'));
app.use(bodyParser.json({
    limit: '50mb'
})); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    limit: '50mb',
    extended: true
}));
app.listen(port, () => console.log(`Server started on ${port}`));
