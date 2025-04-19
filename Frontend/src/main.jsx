import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import MainRoute from './MainRoute';
import { AuthProvider } from './components/AuthContext';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
    <AuthProvider>
    <MainRoute/>  
    </AuthProvider>
  </BrowserRouter>
  </React.StrictMode>
);
