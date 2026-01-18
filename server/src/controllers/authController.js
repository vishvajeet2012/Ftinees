const AuthService = require('../services/AuthService');

class AuthController {
  // @desc    Register new user
  // @route   POST /api/auth/register
  // @access  Public
  async register(req, res, next) {
    try {
      const result = await AuthService.registerUser(req.body);
      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      // If error is "User already exists", send 400
      if (error.message === 'User already exists') {
        res.status(400);
      }
      next(error);
    }
  }

  // @desc    Login user
  // @route   POST /api/auth/login
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }
      
      const result = await AuthService.loginUser(email, password);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      if (error.statusCode === 401) {
        return res.status(401).json({ message: error.message });
      }
      next(error);
    }
  }
}

module.exports = new AuthController();
