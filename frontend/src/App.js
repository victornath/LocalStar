import React from 'react';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import Login from './screens/Login';
import Register from './screens/Register';
import NotFound from './screens/NotFound';
import Lobby from './screens/Lobby';
import Shop from './screens/Shop';
import Inventory from './screens/Inventory';
import PlayerLoader from './screens/Playroom';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<HomeScreen />} exact />;
        <Route path='/login' element={<Login />} />;
        <Route path='/register' element={<Register />} />;
        <Route path='*' element={<NotFound />} />;
        <Route path='/lobby' element={<Lobby />} />;
        <Route path='/shop' element={<Shop />} />;
        <Route path='/inventory' element={<Inventory />} />;
        <Route path='/playroom' element={<PlayerLoader />} />;
      </Routes>
    </Router>
  )
};

export default App;