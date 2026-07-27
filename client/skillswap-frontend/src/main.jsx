import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { UserProvider } from './context/UserContext.jsx';
import { CommunityProvider } from './context/CommunityContext.jsx';
import { AdminProvider } from './context/AdminContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <CommunityProvider>
          <AdminProvider>
            <App />
          </AdminProvider>
        </CommunityProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);
