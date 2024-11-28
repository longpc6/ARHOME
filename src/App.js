import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import HomePage from './pages/HomePage/HomePage';
import ProductPage from './pages/ProductPage/ProductPage';
import RoomBuilderPage from './pages/RoomBuilderPage/RoomBuilderPage';
import LoginPage from './pages/AuthPage/LoginPage';
import SignupPage from './pages/AuthPage/SignupPage';
import ViewerPage from './pages/ViewerPage/ViewerPage';
import FavouritesPage from './pages/FavouritesPage/FavouritesPage';
import './styles/App.css';

const App = () => {
  // State để lưu tọa độ tường và chế độ 2D/3D
  const [walls, setWalls] = useState([]); // Lưu tọa độ các bức tường
  const [is3D, setIs3D] = useState(false); // Lưu trạng thái chế độ (2D hoặc 3D)
  
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductPage />} />
        <Route 
          path="/interior-builder" 
          element={
            <RoomBuilderPage 
              walls={walls} 
              setWalls={setWalls} 
              is3D={is3D} 
              setIs3D={setIs3D} 
            />
          } 
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/viewer" element={<ViewerPage />} />
        <Route path="/favourites" element={<FavouritesPage />} />
      </Routes>
    </Router>
  );
};

export default App;
