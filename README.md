For running the application, follow these steps:
1. Open code editor (VS Code)
2. Split 2 different terminals for running backend and frontend simultaneously
3. cd backend/server in 1st terminal
4. cd frontend in 2nd terminal
5. nodemon server.js in backend/server
6. npm run dev in frontend directory
It will run without any problems

For checking only the backend api calls
1. Open postman
2. Click on GET request
3. Enter 'http://localhost:5000/api/transactions?month=March&page=1&perPage=10' or any other similar routes like statistics, etc
