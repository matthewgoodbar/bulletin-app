import logo from './logo.svg';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import { AuthRoute, ProtectedRoute } from './components/Routes/Routes';
import HomePage from './components/HomePage';
import React from 'react';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
}

export default App;
