var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var Papa = require('babyparse');
var request = require('request');
var fs = require('fs');

app.use(express.static(__dirname + '/public'));

app.listen(port, function (err) {
  if (err) {
    throw err;
  }

  console.log(`server is listening on ${port}...`);
});
