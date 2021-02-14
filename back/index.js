"use strict";
exports.__esModule = true;
var express = require("express");
var app = express();
var prod = process.env.NODE_ENV === 'production';
app.set('port', prod ? process.env.PORT : 3065);
app.get('/', function (req, res, next) {
    res.send('back');
});
app.listen(prod ? process.env.PORT : 3065, function () {
    console.log("server is running " + app.get('port'));
});
