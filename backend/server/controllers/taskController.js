const axios = require('axios');
const moment = require('moment');
const Transaction = require('../models/transaction');

const THIRD_PARTY_API_URL = 'https://s3.amazonaws.com/roxiler.com/product_transaction.json';

// Initialize Database
const initializeDatabase = async (req, res) => {
    try {
        const { data } = await axios.get(THIRD_PARTY_API_URL);
        await Transaction.deleteMany(); // Clear existing data
        await Transaction.insertMany(data);
        res.status(200).json({ message: 'Database initialized with seed data' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to initialize database' });
    }
};

// Helper function to get the month filter
const getMonthFilter = (month) => {
    if (!month) return {};
    const monthIndex = moment().month(month).month();
    // console.log(`Month: ${month}, Month Index: ${monthIndex}`);
    const regex = new RegExp(`-${monthIndex < 9 ? '0' : ''}${monthIndex + 1}-`);
    // console.log(`Month Regex: ${regex}`);
    return { $expr: { $regexMatch: { input: { $dateToString: { format: '%Y-%m-%d', date: '$dateOfSale' } }, regex: regex } } };
};

// Get All Transactions with Search and Pagination
const getAllTransactions = async (req, res) => {
    const { month, search, page = 1, perPage = 10 } = req.query;
    const searchQuery = search ? {
        $or: [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { price: { $regex: search, $options: 'i' } }
        ]
    } : {};

    const monthQuery = getMonthFilter(month);
    // console.log(`Month Query: ${JSON.stringify(monthQuery)}`);

    try {
        const transactions = await Transaction.aggregate([
            { $match: { ...searchQuery, ...monthQuery } },
            { $skip: (page - 1) * perPage },
            { $limit: parseInt(perPage) }
        ]);

        res.status(200).json(transactions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
};

// Get Statistics
const getStatistics = async (req, res) => {
    const { month } = req.query;
    const monthQuery = getMonthFilter(month);

    try {
        const totalSales = await Transaction.aggregate([
            { $match: monthQuery },
            { $group: { _id: null, totalAmount: { $sum: "$price" }, soldCount: { $sum: { $cond: ["$sold", 1, 0] } }, notSoldCount: { $sum: { $cond: ["$sold", 0, 1] } } } }
        ]);

        const stats = totalSales[0] || { totalAmount: 0, soldCount: 0, notSoldCount: 0 };

        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
};

// Get Bar Chart Data
const getBarChart = async (req, res) => {
    const { month } = req.query;
    const monthQuery = getMonthFilter(month);

    try {
        const priceRanges = [
            { range: '0-100', min: 0, max: 100 },
            { range: '101-200', min: 101, max: 200 },
            { range: '201-300', min: 201, max: 300 },
            { range: '301-400', min: 301, max: 400 },
            { range: '401-500', min: 401, max: 500 },
            { range: '501-600', min: 501, max: 600 },
            { range: '601-700', min: 601, max: 700 },
            { range: '701-800', min: 701, max: 800 },
            { range: '801-900', min: 801, max: 900 },
            { range: '901-above', min: 901, max: Infinity }
        ];

        const barChartData = await Promise.all(priceRanges.map(async (range) => {
            const count = await Transaction.countDocuments({
                ...monthQuery,
                price: { $gte: range.min, $lte: range.max === Infinity ? Number.MAX_SAFE_INTEGER : range.max }
            });
            return { range: range.range, count };
        }));

        res.status(200).json(barChartData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch bar chart data' });
    }
};

// Get Pie Chart Data
const getPieChart = async (req, res) => {
    const { month } = req.query;
    const monthQuery = getMonthFilter(month);

    try {
        const categories = await Transaction.aggregate([
            { $match: monthQuery },
            { $group: { _id: "$category", count: { $sum: 1 } } }
        ]);

        const pieChartData = categories.map(category => ({
            category: category._id,
            count: category.count
        }));

        res.status(200).json(pieChartData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch pie chart data' });
    }
};

// Get Combined Data
const getCombinedData = async (req, res) => {
    try {
        const transactions = await getAllTransactions(req, res);
        const statistics = await getStatistics(req, res);
        const barChart = await getBarChart(req, res);
        const pieChart = await getPieChart(req, res);

        res.status(200).json({ transactions, statistics, barChart, pieChart });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch combined data' });
    }
};

module.exports = {
    initializeDatabase,
    getAllTransactions,
    getStatistics,
    getBarChart,
    getPieChart,
    getCombinedData
};
