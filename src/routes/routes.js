import React from 'react';
import {HashRouter, Routes, Route} from 'react-router-dom';
import Home from '../views/Home';

const AppRoutes = () =>
  <HashRouter>
    <Routes>
      <Route exact path='/' element={<Home/>}/>
    </Routes>
  </HashRouter>;

export default AppRoutes;
