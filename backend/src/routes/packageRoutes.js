const express = require('express');
const packageController = require('../controllers/packageController');

const router = express.Router();

// Định tuyến các request liên quan đến packages
router.post('/', packageController.createPackage);
router.get('/', packageController.getAllPackages);
router.put('/:id', packageController.updatePackage);
router.delete('/:id', packageController.deletePackage);

module.exports = router;
