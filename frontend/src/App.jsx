import React from 'react';
import logo from './logo.svg';
import './App.css';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes, Navigate } from 'react-router-dom';
import { AuthRoute, ProtectedRoute } from './components/Routes/Routes';

import HomePage from './components/HomePage';
import Navbar from './components/Navbar';
import ScrollBanner from './components/ScrollBanner';
import Login from './components/Login';
import Signup from './components/Signup';
import Goodbye from './components/Goodbye';
import Posts from './components/Posts';
import FullPost from './components/FullPost';
import NotFound from './components/NotFound';

import { getCurrentUser } from './store/session';

function App() {

  const [loaded, setLoaded] = useState(false);
  const lastBoard = useSelector(state => state.session.lastBoard);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCurrentUser())
      .then(() => setLoaded(true));
  }, [dispatch]);
  
  return loaded && (
    <div className="full-page-content">
      <div id="page-header">
        <h1>HOPNET.ORG</h1>
      </div>
      <ScrollBanner />
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Navigate to={`/board/${lastBoard}`} replace />} />
        <Route exact path="/board/:boardId" element={<Posts />} />
        <Route exact path="/post/:postId" element={<FullPost />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/signup" element={<Signup />} />
        <Route exact path="/goodbye" element={<Goodbye />} />
        <Route exact path="/404" element={<NotFound />} />
        <Route 
          path='*'
          element={<Navigate to='/404' replace />}
        />
      </Routes>
    </div>
  );
}

export default App;
