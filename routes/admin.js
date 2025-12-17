const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { auth, adminAuth } = require('../middleware/auth');

router.use(auth);
router.use(adminAuth);

router.get('/users', adminController.getAllUsers);
router.get('/expenses', adminController.getAllExpenses);
router.get('/tasks', adminController.getAllTasks);
router.get('/stats', adminController.getAdminStats);

module.exports = router;