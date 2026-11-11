export const validateBody = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const errorDetails = result.error.issues.map(
      (issue) => `${issue.path.join('.')}: ${issue.message}`
    );
    return res.status(400).json({
      success: false,
      message: 'Validation failed for request data',
      data: null,
      error: {
        code: 'VALIDATION_ERROR',
        details: errorDetails,
      },
    });
  }
  req.validatedBody = result.data;
  next();
};

export const validateQuery = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.query);
  if (!result.success) {
    const errorDetails = result.error.issues.map(
      (issue) => `${issue.path.join('.')}: ${issue.message}`
    );
    return res.status(400).json({
      success: false,
      message: 'Validation failed for query parameters',
      data: null,
      error: {
        code: 'VALIDATION_ERROR',
        details: errorDetails,
      },
    });
  }
  req.validatedQuery = result.data;
  next();
};

export const validateParams = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.params);
  if (!result.success) {
    const errorDetails = result.error.issues.map(
      (issue) => `${issue.path.join('.')}: ${issue.message}`
    );
    return res.status(400).json({
      success: false,
      message: 'Validation failed for route parameters',
      data: null,
      error: {
        code: 'VALIDATION_ERROR',
        details: errorDetails,
      },
    });
  }
  req.validatedParams = result.data;
  next();
};

