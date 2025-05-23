import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route } from "react-router-dom"
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import SingleProductPage from './pages/SingleProductPage';
import ProfilePage from './pages/ProfilePage';
import RouteNotFound from './pages/RouteNotFound';
import CreateVenue from './pages/CreateVenue';
import EditVenue from './pages/EditVenue';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="/product/:id" element={<SingleProductPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="/venues/create" element={<CreateVenue />} />
          <Route path="/venues/edit/:id" element={<EditVenue />} />
          <Route path="*" element={<RouteNotFound />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
