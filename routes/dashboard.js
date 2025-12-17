const express = require('express');
const { getDashboardStats } = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware(), getDashboardStats);

module.exports = router;