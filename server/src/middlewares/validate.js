const { z } = require('zod');

const validate = (schema) => (req, res, next) => {
  try {
    console.log('📥 Incoming Payload:', JSON.stringify(req.body, null, 2)); // Debug Log
    
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      console.log('❌ Validation Failed:', JSON.stringify(err.errors, null, 2)); // Detailed Log
      return res.status(400).json({
        message: 'Validation failed',
        errors: err.errors,
      });
    }
    next(err);
  }
};

module.exports = validate;
