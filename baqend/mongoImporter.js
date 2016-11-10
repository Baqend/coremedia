var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var GridFSBucket = mongo.GridFSBucket;
var ObjectID = mongo.ObjectID;

var dataURL = 'mongodb://52.212.191.103:27017/blueprint_uapi_models';
var blobURL = 'mongodb://52.212.191.103:27017/blueprint_uapi_blobs';
// Use connect method to connect to the Server

var xml = require('./xml');
var greatestDataTimestamp = 0; //1478654638190;

exports.call = function(db, data, req) {
  return syncImages(db);
};

function syncImages(db) {
  return Promise.all([MongoClient.connect(dataURL), MongoClient.connect(blobURL)]).then(dbs => {
    var mongodb = dbs[0];
    var blobdb = dbs[1];
    var gridfs = new GridFSBucket(blobdb);
    var col = mongodb.collection('content');

    return col.find({_id: "6300"}).toArray().then((result) => {
      //result.forEach((meta) => {
        var data = result[0].userDefined;
        var downloadStream = gridfs.openDownloadStream(new ObjectID(data.data.id));
      db.log({id: data.data.id})
        return new Promise((success, error) => {
          downloadStream.on('file', success);
          downloadStream.on('error', error);
        }).then((file) => {
          db.log(file)
          downloadStream.abort();
          return {file: file};
        });
      //})



      //return result;
    }).then((result) => {
      blobdb.close();
      mongodb.close();
      return result;
    })
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
        var product = db.Product();

        product.key = obj._id;
        product.version = obj.versionNumber;
        product.locale = data.locale;
        product.title = data.productName;
        product.sku = data.productCode;
        product.shortDesc = data.teaserText? data.teaserText.xml: null;
        product.longDesc = data.detailText? data.detailText.xml: null;
        product.mediaLinks = [];

        return xml.parse(data.localSettings.xml).then((props) => {
          Object.assign(product, props.productProperties);
          return product.save({force: true});
        });
      }));
    }).then((result) => {
      mongodb.close();
      return {count: result.length};
    });
  })
}
