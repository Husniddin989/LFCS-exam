// Standardized API response helpers

export const success = (res, data, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data
  });
};

export const created = (res, data) => {
  return success(res, data, 201);
};

export const noContent = (res) => {
  return res.status(204).send();
};

export const error = (res, message, statusCode = 400, details = null) => {
  const response = {
    success: false,
    error: message
  };

  if (details) {
    response.details = details;
  }

  return res.status(statusCode).json(response);
};

export const notFound = (res, message = 'Resource not found') => {
  return error(res, message, 404);
};

export const unauthorized = (res, message = 'Unauthorized') => {
  return error(res, message, 401);
};

export const forbidden = (res, message = 'Forbidden') => {
  return error(res, message, 403);
};

export const validationError = (res, details) => {
  return error(res, 'Validation failed', 422, details);
};

export const serverError = (res, message = 'Internal server error') => {
  return error(res, message, 500);
};
