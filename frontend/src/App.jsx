import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Homes from './components/Homes';
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
  <Route path="/Landing" element={<Landing />} />
  <Route path="/Login" element={<Login />} />
  <Route path="/Register" element={<Register />} />
  <Route path="/Homes" element={<Homes />} />
  <Route path="/Cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
  <Route path="/CheckLogin" element={<ProtectedRoute><CheckLogin /></ProtectedRoute>} />
</Routes>

      </div>
  )
}

export default App;
