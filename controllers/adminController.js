const User = require('../models/User');
const Expense = require('../models/Expense');
const Task = require('../models/Task');

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password -refreshToken');
    res.json({ users });
  } catch (error) {
    next(error);
  }
};

exports.getAllExpenses = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const expenses = await Expense.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Expense.countDocuments();

    res.json({
      expenses,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
        limit: Number(limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllTasks = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const tasks = await Task.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Task.countDocuments();

    res.json({
      tasks,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
        limit: Number(limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalExpenses = await Expense.countDocuments();
    const totalTasks = await Task.countDocuments();

    const expenseSummary = await Expense.aggregate([
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' }
        }
      }
    ]);

    const taskSummary = await Task.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      totalUsers,
      totalExpenses,
      totalTasks,
      expenseSummary,
      taskSummary
    });
  } catch (error) {
    next(error);
  }
};