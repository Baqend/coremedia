var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var GridFSBucket = mongo.GridFSBucket;
var ObjectID = mongo.ObjectID;

var dataURL = 'mongodb://52.212.191.103:27017/blueprint_uapi_models';
var blobURL = 'mongodb://52.212.191.103:27017/blueprint_uapi_blobs';
// Use connect method to connect to the Server

var xml = require('./xml');
var greatestDataTimestamp = 1478799425977; //1478654638190;
var greatestNextBlobTimestamp = 1478654687259;
var greatestBlobTimestamp = 1478654687259; //1478654638190;
var startBlobId = "";
var lastResult = {};

exports.call = function(db, data, req) {
  clearTimeout(global.interval);

  syncInterval(db);

  return lastResult;
};

function syncInterval(db) {
  Promise.all([syncProducts(db), syncImages(db)]).then(result => {
    db.clear();
    db.log('Import completed:', result)
  }).catch((e) => {db.log.error('Import error %s:', e.message, e); return {error: e} }
  ).then((result) => {
    lastResult = result;
    global.interval = setTimeout(syncInterval.bind(this, db), 10000);
  });
}

function syncImages(db) {
  return Promise.all([MongoClient.connect(dataURL), MongoClient.connect(blobURL)]).then(dbs => {
    var mongodb = dbs[0];
    var blobdb = dbs[1];
    var gridfs = new GridFSBucket(blobdb);
    var col = mongodb.collection('content');

    var limit = 100;

    return col.find({"modificationDate.millis": {$gt: greatestBlobTimestamp}, _id: {$gt: startBlobId}, type: "CMPicture"}).sort({_id: 1}).limit(limit).toArray().then((result) => {
      return Promise.all(result.map((meta) => {
        startBlobId = meta._id;
        if (meta.modificationDate.millis > greatestNextBlobTimestamp)
          greatestNextBlobTimestamp = meta.modificationDate.millis;

        var data = meta.userDefined;
        var downloadStream = gridfs.openDownloadStream(new ObjectID(data.data.id));
        //pull some data to let mongo begin streaming data
        downloadStream.read(0);

        return new Promise((success, error) => {
          downloadStream.on('file', success);
          downloadStream.on('error', error);
        }).then((fileMetadata) => {
          var file = new db.File({
            name: meta._id,
            parent: '/picture',
            mimeType: fileMetadata.contentType,
            type: 'stream',
            data: downloadStream,
            size: fileMetadata.length
          });
          return file.upload({force: true});
        }).then((file) => {
          var image = new db.Image(data);
          image.key = meta._id;
          image.file = file.id;
          return image.save({force: true});
        });
      }));
    }).then((result) => {
      if (result.length < limit) {
        greatestBlobTimestamp = greatestNextBlobTimestamp;
        startBlobId = "";
      }

      blobdb.close();
      mongodb.close();
      return {count: result.length, timestamp: greatestNextBlobTimestamp};
    });
  });
}

function syncProducts(db) {
  return MongoClient.connect(dataURL).then(mongodb => {
    var col = mongodb.collection('content');

    return col.find({"modificationDate.millis": {$gt: greatestDataTimestamp}, type: "CMProduct"}).toArray().then((result) => {
      return Promise.all(result.map((obj) => {
        if (obj.modificationDate.millis > greatestDataTimestamp)
          greatestDataTimestamp = obj.modificationDate.millis;

        var data = obj.userDefined;
        var product = db.getReference('Product', obj._id);
        var meta = db.util.Metadata.get(product);
        meta.setDirty();

        product.version = obj.versionNumber;
        product.locale = data.locale;
        product.title = data.productName;
        product.sku = data.productCode;
        product.shortDesc = data.teaserText? data.teaserText.xml: null;
        product.longDesc = data.detailText? data.detailText.xml: null;
        product.mediaLinks = data.pictures? data.pictures.map((id) => '/file/picture/' + id): [];
        product.related = data.related? data.related.map(id => db.getReference('Product', "" + id)): [];
        //product.search = product.title.toLowerCase() + ' ' + strip_tags(product.longDesc.toLowerCase());
        product.search = product.title.toLowerCase();

        return xml.parse(data.localSettings.xml).then((props) => {
          Object.assign(product, props.productProperties);
          return product.save({force: true});
        });
      }));
    }).then((result) => {
      mongodb.close();
      return {count: result.length, timestamp: greatestDataTimestamp};
    });
  })
}

function strip_tags(input, allowed) {
  // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
  allowed = (((allowed || '') + '').toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('');

  var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;

  return input.replace(tags, function ($0, $1) {
    return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : ''
  });
}
