// const axios = require('axios');
// const Transaction = require('../models/Transaction');

// const initializeDatabase = async () => {
//   try {
//     const { data } = await axios.get(process.env.THIRD_PARTY_API_URL);
//     await Transaction.deleteMany({});
//     await Transaction.insertMany(data);
//     console.log('Database initialized with seed data.');
//   } catch (error) {
//     console.error(`Error: ${error.message}`);
//   }
// };

// module.exports = initializeDatabase;
