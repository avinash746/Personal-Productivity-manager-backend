const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const { auth } = require('../middleware/auth');

router.use(auth);

router.post('/', expenseController.createExpense);
router.get('/', expenseController.getExpenses);
router.get('/summary', expenseController.getExpenseSummary);
router.get('/:id', expenseController.getExpenseById);
router.put('/:id', expenseController.updateExpense);
router.delete('/:id', expenseController.deleteExpense);

module.exports = router;