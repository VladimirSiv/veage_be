const loggingHandler = function (err, req, res, next) {
  // TODO configure file logs
  console.log("Error status: ", err.status);
  console.log("Message: ", err.message);
  console.log("Stack: ", err.stack);
  next(err);
};

module.exports = loggingHandler;
