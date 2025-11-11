# Indian Spice Hub

## Setup Instructions
To run the Indian Spice Hub application, you need to ensure that you have the following installed:
- React.js
- Go
- MongoDB server
- Fiber

### Steps to Run the Application

1. **Initialize Backend Data:**
    - In the `data` folder, you'll find initial data required for the backend. Import this data into your MongoDB database.
    - Create an `.env` file in the backend folder and set the database URL:
      ```
      URL=your_database_url_here
      ```

2. **Run Backend Server:**
    - Open a command prompt in the backend folder.
    - Execute the following command to start the backend server:
      ```
      go run main.go
      ```

3. **Start Frontend Server:**
    - Open a new command prompt in the frontend folder.
    - Install the required Node.js modules:
      ```
      npm install
      ```
    - Start the React server:
      ```
      npm start
      ```

4. **Accessing the Application:**
    - Once both backend and frontend servers are running, access the Indian Spice Hub in your browser at [http://localhost:3000](http://localhost:3000).
