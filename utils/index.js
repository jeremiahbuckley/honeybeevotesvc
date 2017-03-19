
const utils = {};

utils.requestTime = function (req, res, next) {
  req.requestTime = Date.now();
  next();
};

module.exports = utils;
