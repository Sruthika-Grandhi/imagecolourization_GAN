/**
 * React Application Entry Point
 * 
 * This file initializes the React application and mounts it to the DOM.
 * The application demonstrates image colourisation using simulated
 * deep learning techniques on the frontend.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';

// Get the root element from the DOM
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the main App component
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
