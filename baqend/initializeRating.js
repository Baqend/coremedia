exports.call = function(db, data, req) {
  return db.send(new db.message.TruncateBucket('Rating')).then(function () {
    return db.Product.find().resultList();
  }).then(function(products){
    products.forEach(function(product) {
      var rating = new db.Rating();
      rating.id = product.key;
      rating.ratings = 1;
      rating.stars = 5;
      rating.save();
    });
  });
};
