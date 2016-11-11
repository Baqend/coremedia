/* Require additional modules and handlers here */
var lwip = require('lwip');

exports.get = function(db, req, res) {
  //var host = req.query.host;
  //var path = req.query.path;
  var id = req.query.id;
  var width = Number(req.query.width);
  var height = Number(req.query.height);

  return loadImage(db, id).then((response) => {
    if (width || height)
      return resizeImage(db, response, width, height);

    return response;
  }).then(function(response) {
    //res.set('Surrogate-Control', 'max-age=3600');
    res.set('Cache-Control', 'max-age=0');
    res.set('Content-Type', response.contentType);
    res.send(response.data);
  });
};

var IMG_OPTIONS = {
  jpeg: {
    quality: 80,
  },
  png: {
    compression: 'high'
  }
};

function resizeImage(db, img, width, height) {
  var type = img.contentType.replace(/image\/(.*)/, '$1');

  return new Promise((success, error) => {
    lwip.open(img.data, type, (err, image) => {
      if (err) {
        error(err);
        return;
      }

      var ratio = (1.0 * image.width()) / image.height();
      var scaleWidth = image.width();
      var scaleHeight = image.height();
      if (width && height) {
        if ((1.0 * width) / height < ratio) {
          scaleWidth = height * ratio;
          scaleHeight = height;
        } else {
          scaleWidth = width;
          scaleHeight = width / ratio;
        }
      } else {
        if (!width)
          scaleWidth = image.width() * height / image.height();
        else
          scaleWidth = width;
        if (!height)
          scaleHeight = image.height() * width / image.width();
        else
          scaleHeight = height;
        width = scaleWidth;
        height = scaleHeight;
      }

      image.batch()
        .resize(scaleWidth, scaleHeight)
        .crop(width, height)
        .toBuffer(type, IMG_OPTIONS[type], (err, buffer) => {
          if (err) {
            error(err);
            return;
          }

          success({
            contentType: img.contentType,
            data: buffer
          });
        });
    });
  });
}

function loadImage(db, id) {
  var file = new db.File(id);
  return file.download('buffer').then(data => {
    return {
      data: data,
      contentType: file.mimeType
    }
  });
}

function requestImage(host, path) {
  return new Promise((success, error) => {
    var httpReq = http.request({
      method: 'GET',
      hostname: host,
      path: path
    }, (httpRes) => {
      var chunks = [];
      httpRes.on('data', (chunk) => {
        chunks.push(chunk);
      });
      httpRes.on('end', () => {
        success({
          contentType: httpRes.headers['content-type'],
          data: Buffer.concat(chunks)
        });
      });
    });

    httpReq.on('error', error);
    httpReq.end();
  });
}
