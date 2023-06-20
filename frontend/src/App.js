import React from 'react';
import logo from './logo.svg';
import './App.css';

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Routes, Navigate } from 'react-router-dom';
import { AuthRoute, ProtectedRoute } from './components/Routes/Routes';

import HomePage from './components/HomePage';
import Login from './components/Login';
import Signup from './components/Signup';
import Goodbye from './components/Goodbye';
import NotFound from './components/NotFound';

import { getCurrentUser } from './store/session';

function App() {

  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCurrentUser())
      .then(() => setLoaded(true));
  }, [dispatch]);
  
  return loaded && (
    <Routes>
      <Route exact path="/" element={<HomePage />} />
      <Route exact path="/login" element={<Login />} />
      <Route exact path="/signup" element={<Signup />} />
      <Route exact path="/goodbye" element={<Goodbye />} />
      <Route exact path="/404" element={<NotFound />} />
      <Route 
        path='*'
        element={<Navigate to='/404' replace />}
      />
    </Routes>
  );
}

export default App;
