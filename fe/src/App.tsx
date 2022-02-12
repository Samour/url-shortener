import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import './App.css';
import LoginView from './views/LoginView';
import LandingView from './views/LandingView';
import RegisterView from './views/RegisterView';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingView/>}/>
        <Route path='/login' element={<LoginView/>}/>
        <Route path='/register' element={<RegisterView/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
