const requestLogger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    error: 'Route not found'
  });
};

const globalErrorHandler = (err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    error: 'Something went wrong'
  });
};

module.exports = {
  requestLogger,
  notFoundHandler,
  globalErrorHandler,
};