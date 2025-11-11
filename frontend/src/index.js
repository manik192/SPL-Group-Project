// import React from 'react';
// import ReactDOM from 'react-dom';
// import { BrowserRouter, Redirect, Switch, Route } from 'react-router-dom';
// import App from './App';
// import reportWebVitals from './reportWebVitals';

// import Homes from './components/Homes';
// import OrderPizza from './components/OrderPizza';          // (legacy, kept in case you still use it somewhere)
// import BuildUrPizza from './components/BuildUrPizza';
// import Login from './components/Login';
// import Register from './components/Register';
// import Cart from './components/Cart';
// import Cartt from './components/Cartt';
// import CheckLogin from './components/CheckLogin';
// import ProtectedRoute from './components/ProtectedRoute';
// import { AuthProvider } from './AuthContext';
// import RestaurantList from './components/RestaurantList';
// import RestaurantDashboard from './components/RestaurantDashboard';
// import RestaurantMenu from './components/RestaurantMenu';

// ReactDOM.render(
//   <BrowserRouter>
//     <AuthProvider>
//       {/* App usually holds Navbar/Layout */}
//       <App />

//       <Switch>
//         {/* Root -> Order Here */}
//         <Route exact path="/" render={() => <Redirect to="/Homes" />} />

//         {/* Auth */}
//         <Route path="/Login" component={Login} />
//         <Route path="/Register" component={Register} />

//         {/* Order Here (home/hero) */}
//         <Route exact path="/Homes" component={Homes} />

//         {/* Back-compat: /Menu should now go to /restaurants */}
//         <Route
//           exact
//           path="/Menu"
//           render={() => <Redirect to="/restaurants" />}
//         />

//         {/* Keep legacy OrderPizza in case it's referenced somewhere */}
//         <ProtectedRoute exact path="/OrderPizza" component={OrderPizza} />

//         {/* Build-your-meal */}
//         <ProtectedRoute path="/BuildYourMeal" component={BuildUrPizza} />

//         {/* Cart */}
//         <ProtectedRoute path="/Cart" component={Cart} />
//         <ProtectedRoute path="/Cartt" component={Cartt} />

//         {/* Misc */}
//         <ProtectedRoute path="/CheckLogin" component={CheckLogin} />

//         {/* Restaurant owner dashboard */}
//         <ProtectedRoute path="/restaurant/dashboard" component={RestaurantDashboard} />

//         {/* Public: restaurant discovery + per-restaurant menu */}
//         <Route exact path="/restaurants" component={RestaurantList} />
//         <Route path="/restaurants/:id" component={RestaurantMenu} />
//       </Switch>
//     </AuthProvider>
//   </BrowserRouter>,
//   document.getElementById('root')
// );

// reportWebVitals();
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Import Tailwind/global CSS once at the top-level entry
import './index.css';

ReactDOM.render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>,
  document.getElementById('root')
);

reportWebVitals();
