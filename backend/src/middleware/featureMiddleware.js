const db = require('../config/db');

// Middleware dạng High-Order Function (Hàm trả về hàm)
const requireFeature = (requiredFeature) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.id;

      // Truy vấn trực tiếp xem user có sở hữu feature này từ các gói đã mua không
      const checkResult = await db.query(
        `SELECT 1 
         FROM transactions t
         JOIN packages p ON t.package_id = p.id
         WHERE t.user_id = $1 
         AND t.status = 'COMPLETED'
         AND p.features ? $2`,
        [userId, requiredFeature]
      );

      // p.features ? $2 là toán tử đặc biệt của PostgreSQL dành cho JSONB 
      // để kiểm tra xem mảng JSON có chứa phần tử $2 không.

      if (checkResult.rows.length === 0) {
        return res.status(403).json({ 
          success: false, 
          message: \`Bạn cần nâng cấp gói để sử dụng tính năng: \${requiredFeature}\` 
        });
      }

      // Nếu có feature, cho phép đi tiếp vào Controller
      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server Error trong lúc kiểm tra quyền' });
    }
  };
};

module.exports = requireFeature;
