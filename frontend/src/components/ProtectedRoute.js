// import React from 'react';
// import { Route, Redirect } from 'react-router-dom';

// const ProtectedRoute = ({ component: Component, ...rest }) => {
//     const isLoggedIn = localStorage.getItem('loggedIn') === '1'; // Check if the user is logged in

//     return (
//         <Route
//             {...rest}
//             render={(props) =>
//                 isLoggedIn ? (
//                     <Component {...props} />
//                 ) : (
//                     <Redirect to="/Login" /> // Redirect to login page if not logged in
//                 )
//             }
//         />
//     );
// };

// export default ProtectedRoute;

// ProtectedRoute.js
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useContext(AuthContext);
  if (!isLoggedIn) {
    return <Navigate to="/Login" replace />;
  }
  return children;
};

export default ProtectedRoute;
