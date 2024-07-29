// routes/taskRoutes.js
const express = require('express');
const {
    initializeDatabase,
    getAllTransactions,
    getStatistics,
    getBarChart,
    getPieChart,
    getCombinedData
} = require('../controllers/taskController');

const router = express.Router();

router.get('/initialize', initializeDatabase);
router.get('/transactions', getAllTransactions);
router.get('/statistics', getStatistics);
router.get('/barchart', getBarChart);
router.get('/piechart', getPieChart);
router.get('/combined', getCombinedData);

module.exports = router;
