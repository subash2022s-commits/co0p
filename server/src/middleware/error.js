export const errorHandler = (err, req, res, next) => {
  console.error('Unhandled server error:', err);

  const statusCode = err.statusCode || (res.statusCode >= 400 ? res.statusCode : 500);

  res.status(statusCode).json({
    success: false,
    message: err.message || 'An unexpected internal error occurred',
    data: null,
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      details: err.details || [err.message],
    },
  });
};

export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route not found: ${req.method} ${req.originalUrl}`,
    data: null,
    error: {
      code: 'ROUTE_NOT_FOUND',
      details: [`Endpoint ${req.originalUrl} does not exist on this server.`],
    },
  });
};

