const express = require('express');
const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Tất cả các route ở đây đều phải đi qua authMiddleware để kiểm tra đăng nhập
router.use(authMiddleware);

router.post('/purchase', transactionController.purchasePackage);
router.get('/', transactionController.getMyTransactions);

module.exports = router;
