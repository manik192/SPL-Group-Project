import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Homes from './components/Homes';
import OrderPizza from './components/OrderPizza';
import BuildUrPizza from './components/BuildUrPizza';
import Login from './components/Login';
import Register from './components/Register';
import Cart from './components/Cart';
import CheckLogin from './components/CheckLogin';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './components/Landing';

function App() {
  return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Homes" element={<Homes />} />
          <Route path="/Menu" element={<ProtectedRoute><OrderPizza /></ProtectedRoute>} />
          <Route path="/BuildUrPizza" element={<ProtectedRoute><BuildUrPizza /></ProtectedRoute>} />
          <Route path="/Cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/CheckLogin" element={<ProtectedRoute><CheckLogin /></ProtectedRoute>} />
        </Routes>
      </div>
  )
}

export default App;
