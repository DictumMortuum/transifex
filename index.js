"use strict";

const fs = require('fs');
const request = require('request');
const csv = require('json2csv-stream');
const conf = require('minimist')(process.argv.slice(2), {
  default: {
    api: 'http://transifex.com/api/2',
    path: '/tmp',
    ttl: 10000 //ms
  }
});

var info = {};

if(conf._.length == 1) {
  info.url = `${conf.api}/language/${conf._[0]}`,
  info.file = `${conf.path}/${conf._[0]}`
} else {
  info.url = `${conf.api}/languages`,
  info.file = `${conf.path}/languages`
}

fs.stat(info.file, (err, stats) => {
  var req;
  // If the cached item has expired hit the API again and re-cache.
  if(err || new Date - stats.birthtime > conf.ttl) {
    req = request(info.url, (err) => {
      if(err) {
        process.exit(1);
      }
    });
    req.pipe(fs.createWriteStream(info.file));
  } else {
    req = fs.createReadStream(info.file);
  }
  // .csv generation occurs when no arguments are provided.
  if(conf._.length == 0) {
    req.pipe(new csv()).pipe(fs.createWriteStream('out.csv'));
  }
  req.pipe(process.stdout);
});
