import './App.css';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Login from './Pages/Login/Login'
import Home from './Pages/Home'
import React, {useState} from 'react';
import EditProduct from './Pages/EditProduct'
import ProductDetails from './Pages/ProductDetails'
import ProductCreation from './Pages/ProductCreation'
import useTokenandId from './Components/useTokenandId';
import { AuthContext } from './global';

function App() {

  const { token, id, setToken, setId, removeInfo } = useTokenandId();

  //we check if the token has been set. If not, we render the login page
  if (!token) {
    return (
      <div>
        <Login setToken={setToken} setId={setId}/>
      </div>
    )
  } else {
    console.log(token)
  }

  //Router is what holds all the routes. It is like the navigation container in react native.
  //Routes is like the Stack navigator, it holds all the routes
  return (
    <>
      <AuthContext.Provider value={{token: token, logout: removeInfo, id: id}}>
        <Router>
            <Routes>
              <Route path="/" element={<Home/>}/>
              <Route exact path="/:id" element={<ProductDetails/>}/>
              <Route exact path="/:id/edit" element={<EditProduct/>} />
              <Route exact path="/create" element={<ProductCreation/>} />
            </Routes>
          </Router>
        
      </AuthContext.Provider>
    </>
  );
}

export default App;
