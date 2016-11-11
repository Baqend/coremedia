exports.call = function(db, data, req) {
  db.log.info('new rating', {data: data})
  return db.Rating.load(data.productKey).then(function(r) {
    return r.optimisticSave(function(rating) {
      var n = rating.ratings + 1;
      rating.ratings = n;
      rating.stars = ((n-1)/n) * rating.stars + data.stars / n;
    });
  });
};

