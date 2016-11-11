exports.call = function (db, data, req) {
  return db.Product.find().resultList()
    .then(function (products) {
      products.forEach(function (product) {
        var rating = new db.Rating();
        rating.id = product.key;
        rating.ratings = 0;
        rating.stars = 0;
        rating.save();
      });
    });
};
