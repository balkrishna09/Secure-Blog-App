import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import Navbar from './components/Navbar';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import PostForm from './components/PostForm';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <LoginForm />
                  </PublicRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <PublicRoute>
                    <RegisterForm />
                  </PublicRoute>
                }
              />
              <Route path="/post/:id" element={<PostDetail />} />
              <Route
                path="/create-post"
                element={
                  <ProtectedRoute>
                    <PostForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edit-post/:id"
                element={
                  <ProtectedRoute>
                    <PostForm isEdit />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
