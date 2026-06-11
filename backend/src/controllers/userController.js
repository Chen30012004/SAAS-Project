const db = require('../config/db');

const userController = {
  // Lấy thông tin cá nhân (Credits & Features)
  getMe: async (req, res) => {
    try {
      const userId = req.user.id;

      // 1. Lấy thông tin user cơ bản (để biết current_credits)
      const userResult = await db.query('SELECT id, email, current_credits FROM users WHERE id = $1', [userId]);
      if (userResult.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      const user = userResult.rows[0];

      // 2. Lấy danh sách các Feature mà user đang sở hữu từ các gói đã mua
      // (Dùng SQL JOIN để kết nối bảng transactions và packages)
      const featuresResult = await db.query(
        `SELECT DISTINCT jsonb_array_elements_text(p.features) as feature
         FROM transactions t
         JOIN packages p ON t.package_id = p.id
         WHERE t.user_id = $1 AND t.status = 'COMPLETED'`,
        [userId]
      );

      // Chuyển kết quả object array thành một mảng string đơn giản: ['IMAGE_GENERATION', 'AUTO_POST']
      const features = featuresResult.rows.map(row => row.feature);

      res.status(200).json({
        success: true,
        data: {
          ...user,
          unlocked_features: features
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  }
};

module.exports = userController;
