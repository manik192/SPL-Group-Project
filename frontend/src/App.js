// import './App.css';
// import bootstap from '../node_modules/bootstrap/dist/css/bootstrap.min.css'
// import Navbar from './components/Navbar';

// import './index.css'
// function App() {
//   return (
//       <div className="App">
//         <Navbar />
//       </div>

//   )
// }

// export default App;
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Homes from './components/Homes';
import OrderPizza from './components/OrderPizza';
import BuildUrPizza from './components/BuildUrPizza';
import Login from './components/Login';
import Register from './components/Register';
import Cart from './components/Cart';
import Cartt from './components/Cartt';
import CheckLogin from './components/CheckLogin';
import ProtectedRoute from './components/ProtectedRoute'; // See note below!
import RestaurantList from './components/RestaurantList';
import RestaurantDashboard from './components/RestaurantDashboard';
import RestaurantMenu from './components/RestaurantMenu';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        {/* Home/Landing page */}
        <Route path="/" element={<Homes />} />

        {/* Auth */}
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />

        {/* Home/hero */}
        <Route path="/Homes" element={<Homes />} />

        {/* Legacy /Menu -> /restaurants */}
        <Route path="/Menu" element={<Navigate to="/restaurants" replace />} />

        {/* Protected routes (change logic per v6, see notes below!) */}
        {/* For v6, you must use element={<ProtectedRoute><OrderPizza /></ProtectedRoute>} */}
        <Route path="/OrderPizza" element={
          <ProtectedRoute>
            <OrderPizza />
          </ProtectedRoute>
        } />

        <Route path="/BuildYourMeal" element={
          <ProtectedRoute>
            <BuildUrPizza />
          </ProtectedRoute>
        } />

        <Route path="/Cart" element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        } />
        <Route path="/Cartt" element={
          <ProtectedRoute>
            <Cartt />
          </ProtectedRoute>
        } />

        <Route path="/CheckLogin" element={
          <ProtectedRoute>
            <CheckLogin />
          </ProtectedRoute>
        } />

        {/* Restaurant dashboard */}
        <Route path="/restaurant/dashboard" element={
          <ProtectedRoute>
            <RestaurantDashboard />
          </ProtectedRoute>
        } />

        {/* Public: restaurant discovery + per-restaurant menu */}
        <Route path="/restaurants" element={<RestaurantList />} />
        <Route path="/restaurants/:id" element={<RestaurantMenu />} />

        {/* Catch-all: redirect unknown paths to /Login */}
        <Route path="*" element={<Navigate to="/Login" replace />} />
      </Routes>
    </div>
  );
}

export default App;
