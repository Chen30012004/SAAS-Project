const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // 1. Lấy token từ header Authorization
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Không tìm thấy token xác thực' });
  }

  const token = authHeader.split(' ')[1]; // Tách chữ Bearer lấy phần token

  try {
    // 2. Xác thực token với JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 3. Gắn thông tin user vào request để các controller phía sau dùng
    req.user = decoded;
    
    // 4. Cho phép đi tiếp
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token không hợp lệ hoặc đã hết hạn' });
  }
};

module.exports = authMiddleware;
