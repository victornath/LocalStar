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
import Congklak from './screens/Congklak';
import Chat from "./screens/Chat";
import GobakSodor from "./screens/GobakSodor";
import BalapKarung from './screens/BalapKarung';
import TarikTambang from './screens/TarikTambang';
import Profile from './screens/Profile';
import Event from './screens/Event';
import Help_Congklak from './screens/Help_Congklak';
import Help_GobakSodor from './screens/Help_GobakSodor';
import Help_TarikTambang from './screens/Help_TarikTambang';
import Help_BalapKarung from './screens/Help_BalapKarung';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<HomeScreen />} exact />;
        <Route path='/login' element={<Login />} />;
        <Route path='/register' element={<Register />} />;
        <Route path='/profile' element={<Profile />} />;
        <Route path='*' element={<NotFound />} />;
        <Route path='/lobby' element={<Lobby />} />;
        <Route path='/shop' element={<Shop />} />;
        <Route path='/inventory' element={<Inventory />} />;
        <Route path='/playroom' element={<PlayerLoader />} />;
        <Route path="/chat" element={<Chat />} />;
        <Route path="/event" element={<Event />} />;
        <Route path='/congklak' element={<Congklak />} />;
        <Route path='/gobaksodor' element={<GobakSodor />} />;
        <Route path='/karung' element={<BalapKarung />} />;
        <Route path='/tambang' element={<TarikTambang />} />;
        <Route path='help/congklak' element={<Help_Congklak />} />;
        <Route path='help/gobak-sodor' element={<Help_GobakSodor />} />;
        <Route path='help/tarik-tambang' element={<Help_TarikTambang />} />;
        <Route path='help/balap-karung' element={<Help_BalapKarung />} />;
      </Routes>
    </Router>
  )
};

export default App;