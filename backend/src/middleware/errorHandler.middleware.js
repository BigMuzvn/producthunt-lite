export const errorHandler = (err, req, res, next) => {
  console.error('❌ Erreur API capturée :', err);

  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    message: err.message || 'Erreur serveur interne',
    error: process.env.NODE_ENV === 'production' ? null : err.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
};

export default errorHandler;
