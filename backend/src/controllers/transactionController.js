const db = require('../config/db');

const transactionController = {
  // Mua gói tín dụng
  purchasePackage: async (req, res) => {
    const { packageId } = req.body;
    const userId = req.user.id; // Lấy từ authMiddleware

    // Lấy một kết nối riêng biệt từ pool để chạy Transaction
    const client = await db.pool.connect();

    try {
      // 1. Lấy thông tin gói
      const packageResult = await client.query('SELECT * FROM packages WHERE id = $1', [packageId]);
      if (packageResult.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy gói' });
      }
      const pkg = packageResult.rows[0];

      // BẮT ĐẦU TRANSACTION
      await client.query('BEGIN');

      // 2. Trừ tiền (Ở môi trường thực tế, bước này là gọi cổng thanh toán VNPay/Stripe)
      // Trong dự án này, ta giả lập thanh toán luôn thành công.
      
      // 3. Lưu lịch sử giao dịch vào bảng transactions
      const transactionResult = await client.query(
        `INSERT INTO transactions (user_id, package_id, amount, status) 
         VALUES ($1, $2, $3, 'COMPLETED') RETURNING *`,
        [userId, pkg.id, pkg.price]
      );

      // 4. Cộng credits vào tài khoản User
      await client.query(
        `UPDATE users SET current_credits = current_credits + $1 WHERE id = $2`,
        [pkg.credits, userId]
      );

      // NẾU TẤT CẢ BƯỚC TRÊN THÀNH CÔNG -> LƯU VÀO DATABASE
      await client.query('COMMIT');

      res.status(200).json({ 
        success: true, 
        message: 'Mua gói thành công', 
        data: transactionResult.rows[0] 
      });

    } catch (error) {
      // NẾU CÓ BẤT KỲ LỖI GÌ -> HOÀN TÁC TOÀN BỘ
      await client.query('ROLLBACK');
      console.error('Transaction Error:', error);
      res.status(500).json({ success: false, message: 'Lỗi giao dịch, đã hoàn tiền' });
    } finally {
      // Trả kết nối lại cho pool để người khác dùng
      client.release();
    }
  },

  // Lấy lịch sử giao dịch của user
  getMyTransactions: async (req, res) => {
    try {
      const userId = req.user.id;
      const result = await db.query(
        `SELECT t.*, p.name as package_name 
         FROM transactions t 
         JOIN packages p ON t.package_id = p.id 
         WHERE t.user_id = $1 
         ORDER BY t.created_at DESC`,
        [userId]
      );
      res.status(200).json({ success: true, data: result.rows });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  }
};

module.exports = transactionController;
