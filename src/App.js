import React from 'react';
import './App.css';
import './scss/styles.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route } from "react-router-dom"
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import RegisterLogin from './pages/RegisterLoginPage';
import RouteNotFound from './pages/RouteNotFound';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="register" element={<RegisterLogin />} />
          <Route path="login" element={<RegisterLogin />} />
          <Route path="*" element={<RouteNotFound />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
