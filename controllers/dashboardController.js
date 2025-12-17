const Expense = require('../models/Expense');
const Task = require('../models/Task');

exports.getDashboardStats = async (req, res) => {
  try {
    // Expense stats
    const expensePipeline = [
      { $match: { user: req.user.id } },
      { $group: { _id: '$type', total: { $sum: '$amount' } } },
    ];
    const expenseResult = await Expense.aggregate(expensePipeline);
    const income = expenseResult.find(r => r._id === 'income')?.total || 0;
    const expenseTotal = expenseResult.find(r => r._id === 'expense')?.total || 0;

    // Task stats
    const taskPipeline = [
      { $match: { user: req.user.id } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ];
    const taskResult = await Task.aggregate(taskPipeline);
    const totalTasks = taskResult.reduce((acc, r) => acc + r.count, 0);
    const completed = taskResult.find(r => r._id === 'completed')?.count || 0;

    // Charts data
    const expenseByCategory = await Expense.aggregate([
      { $match: { user: req.user.id, type: 'expense' } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
    ]);
    const tasksByStatus = taskResult;

    // Recent activity
    const recentExpenses = await Expense.find({ user: req.user.id }).sort({ date: -1 }).limit(5);
    const recentTasks = await Task.find({ user: req.user.id }).sort({ dueDate: -1 }).limit(5);

    res.json({
      expenseStats: { totalIncome: income, totalExpense: expenseTotal, netBalance: income - expenseTotal },
      taskStats: { totalTasks, completedTasks: completed, pendingTasks: totalTasks - completed },
      expenseChart: expenseByCategory,
      taskChart: tasksByStatus,
      recentExpenses,
      recentTasks,
    });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};