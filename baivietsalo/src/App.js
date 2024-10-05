import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import BlogList from './pages/BlogList';
import BlogCreate from './pages/BlogCreate';
import BlogDetail from './pages/BlogDetail';
import BlogEdit from './pages/BlogEdit';
import SearchResults from './pages/SearchResults';
import Navbar from './components/Navbar';
import './App.css'

const PrivateRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user ? children : <Navigate to="/login" />;
};

const Layout = ({ children }) => {
  const location = useLocation();
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/register';
  
  return (
    <>
      {!isAuthRoute && <Navbar />}
      {children}
    </>
  );
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<PrivateRoute><BlogList /></PrivateRoute>} />
          <Route path="/blogs" element={<PrivateRoute><BlogList /></PrivateRoute>} />
          <Route path="/blogs/create" element={<PrivateRoute><BlogCreate /></PrivateRoute>} />
          <Route path="/blogs/:id" element={<PrivateRoute><BlogDetail /></PrivateRoute>} />
          <Route path="/blogs/edit/:id" element={<PrivateRoute><BlogEdit /></PrivateRoute>} />
          <Route path="/blogs/search" element={<PrivateRoute><SearchResults /></PrivateRoute>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
