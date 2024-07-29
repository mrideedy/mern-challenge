// src/App.jsx
// src/App.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactECharts from 'echarts-for-react'; 
import './App.css';

const App = () => {
  const [transactions, setTransactions] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [barChartData, setBarChartData] = useState([]);
  // const [pieChartData, setPieChartData] = useState([])
  const [month, setMonth] = useState("March");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  useEffect(() => {
    fetchTransactions();
    fetchStatistics();
    fetchBarChartData();
  }, [month]);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/transactions?month=${month}&search=${search}&page=${page}&perPage=${perPage}`);
      setTransactions(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/statistics?month=${month}`);
      setStatistics(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchBarChartData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/barchart?month=${month}`);
      setBarChartData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleMonthChange = (event) => {
    setMonth(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handlePageChange = (event) => {
    setPage(event.target.value);
  };

  const handlePerPageChange = (event) => {
    setPerPage(event.target.value);
  };

  return (
    <div>
      <h1>Transactions</h1>
      <select value={month} onChange={handleMonthChange}>
        <option value="January">January</option>
        <option value="February">February</option>
        <option value="March">March</option>
        <option value="April">April</option>
        <option value="May">May</option>
        <option value="June">June</option>
        <option value="July">July</option>
        <option value="August">August</option>
        <option value="September">September</option>
        <option value="October">October</option>
        <option value="November">November</option>
        <option value="December">December</option>
      </select>
      <input type="search" value={search} onChange={handleSearchChange} placeholder="Search transactions" />
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.id}</td>
              <td>{transaction.title}</td>
              <td>{transaction.description}</td>
              <td>{transaction.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button onClick={() => setPage(page - 1)}>Previous</button>
        <button onClick={() => setPage(page + 1)}>Next</button>
      </div>
      <h1>Statistics</h1>
      <div>
        <p>Total amount of sale: {statistics.totalAmount}</p>
        <p>Total sold items: {statistics.soldCount}</p>
        <p>Total not sold items: {statistics.notSoldCount}</p>
      </div>
      <h1>Bar Chart</h1>
      <ReactECharts
        option={{
          title: {
            text: 'Bar Chart'
          },
          tooltip: {},
          legend: {
            data: ['Price Range']
          },
          xAxis: {
            type: 'category',
            data: barChartData.map((item) => item.range)
          },
          yAxis: {
            type: 'value'
          },
          
          series: [
            {
              name: 'Price Range',
              type: 'bar',
              data: barChartData.map((item) => item.count)
            }
          ]
        }}
      />
    </div>
  );
};

export default App;