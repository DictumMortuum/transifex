const fs = require('fs');
const request = require('request');
const conf = {
  api: 'http://transifex.com/api/2',
  path: 'tmp',
  ttl: 10000 //ms
};

(function(arg) {
  var info = {};
  var req;

  if(arg.length == 1) {
    info.url = `${conf.api}/language/${arg[0]}`,
    info.file = `${conf.path}/${arg[0]}`
    info.csv = false;
  } else {
    info.url = `${conf.api}/languages`,
    info.file = `${conf.path}/languages`
    info.csv = true;
  }

  fs.stat(info.file, (err, stats) => {
    // If the cached item has expired hit the API again and re-cache.
    if(err || new Date - stats.birthtime > conf.ttl) {
      req = request(info.url);
      req.pipe(fs.createWriteStream(info.file));
    } else {
      req = fs.createReadStream(info.file);
    }

    if(info.csv) {
      const csv = require('json2csv-stream');
      req.pipe(new csv()).pipe(fs.createWriteStream('out.csv'));
    }
  });
})(process.argv.slice(2));
