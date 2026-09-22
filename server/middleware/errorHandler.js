export function errorHandler(err, req, res, next) {
  // Log detailed error server-side
  console.error('[API ERROR]:', err.stack || err.message);

  const statusCode = err.statusCode || 500;
  
  // In production, sanitize 500 internal server error messages to prevent details leak
  let clientMessage = err.message || 'Internal Server Error';
  if (process.env.NODE_ENV === 'production' && statusCode >= 500) {
    clientMessage = 'Internal server error. Please contact system administrator.';
  }

  res.status(statusCode).json({
    success: false,
    message: clientMessage,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
}

