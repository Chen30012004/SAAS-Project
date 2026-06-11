const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const requireFeature = require('../middleware/featureMiddleware');

const router = express.Router();

// Tất cả route AI đều yêu cầu đăng nhập
router.use(authMiddleware);

// Route mô phỏng việc tạo ảnh AI, yêu cầu phải có tính năng 'IMAGE_GENERATION'
router.post(
  '/generate-image', 
  requireFeature('IMAGE_GENERATION'), 
  (req, res) => {
    // Nếu qua được middleware, nghĩa là có quyền
    res.status(200).json({ 
      success: true, 
      message: 'Tạo ảnh thành công (Mô phỏng)', 
      imageUrl: 'https://example.com/generated-image.png' 
    });
  }
);

// Route mô phỏng Auto Post, yêu cầu 'AUTO_POST'
router.post(
  '/auto-post', 
  requireFeature('AUTO_POST'), 
  (req, res) => {
    res.status(200).json({ success: true, message: 'Đăng bài tự động thành công' });
  }
);

module.exports = router;
