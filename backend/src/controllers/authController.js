const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const authController = {
  // Đăng ký người dùng mới
  register: async (req, res) => {
    try {
      const { email, password } = req.body;

      // 1. Kiểm tra email đã tồn tại chưa
      const userExists = await db.query('SELECT * FROM users WHERE email = $1', [email]);
      if (userExists.rows.length > 0) {
        return res.status(400).json({ success: false, message: 'Email đã được sử dụng' });
      }

      // 2. Mã hóa (hash) mật khẩu
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // 3. Lưu vào Database (Mặc định current_credits = 0)
      const newUser = await db.query(
        'INSERT INTO users (email, password, current_credits) VALUES ($1, $2, 0) RETURNING id, email, current_credits',
        [email, hashedPassword]
      );

      res.status(201).json({ success: true, message: 'Đăng ký thành công', data: newUser.rows[0] });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  },

  // Đăng nhập
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // 1. Tìm user theo email
      const userResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
      if (userResult.rows.length === 0) {
        return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không đúng' });
      }

      const user = userResult.rows[0];

      // 2. So sánh mật khẩu đã hash
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không đúng' });
      }

      // 3. Tạo JWT Token (thời hạn 1 ngày)
      const payload = { id: user.id, email: user.email };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

      res.status(200).json({ 
        success: true, 
        message: 'Đăng nhập thành công',
        token,
        data: { id: user.id, email: user.email, current_credits: user.current_credits }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  }
};

module.exports = authController;
