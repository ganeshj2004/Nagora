import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import App from './App.jsx';
import './styles/global.css';

// Configure default API Base URL if VITE_API_URL or VITE_API_BASE_URL is defined
const apiUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL;
if (apiUrl) {
  axios.defaults.baseURL = apiUrl;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

