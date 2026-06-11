const db = require('../config/db');

const packageController = {
  // CREATE: Tạo gói mới
  createPackage: async (req, res) => {
    try {
      const { name, description, price, credits, features } = req.body;
      
      // Sử dụng Parameterized Query ($1, $2) để chống SQL Injection
      const result = await db.query(
        `INSERT INTO packages (name, description, price, credits, features) 
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [name, description, price, credits, JSON.stringify(features)]
      );
      
      res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  },

  // READ: Lấy danh sách gói
  getAllPackages: async (req, res) => {
    try {
      const result = await db.query('SELECT * FROM packages ORDER BY price ASC');
      res.status(200).json({ success: true, data: result.rows });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  },

  // UPDATE: Cập nhật thông tin gói
  updatePackage: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, price, credits, features } = req.body;
      
      const result = await db.query(
        `UPDATE packages 
         SET name = $1, description = $2, price = $3, credits = $4, features = $5 
         WHERE id = $6 RETURNING *`,
        [name, description, price, credits, JSON.stringify(features), id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Package not found' });
      }

      res.status(200).json({ success: true, data: result.rows[0] });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  },

  // DELETE: Xóa gói
  deletePackage: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await db.query('DELETE FROM packages WHERE id = $1 RETURNING *', [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Package not found' });
      }

      res.status(200).json({ success: true, message: 'Package deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  }
};

module.exports = packageController;
