import React from 'react';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import Login from './screens/Login';
import Register from './screens/Register';
import NotFound from './screens/NotFound';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<HomeScreen />} exact />;
        <Route path='/login' element={<Login />} />;
        <Route path='/register' element={<Register />} />;
        <Route path='*' element={<NotFound />} />;
      </Routes>
    </Router>
  )
};

export default App;