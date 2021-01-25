const errorHandler = function (err, req, res, next) {
  res.status(err.status).json({
    status: err.status,
    message: err.message,
  });
};

module.exports = errorHandler;
