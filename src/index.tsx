import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Find the root element in the DOM
const rootElement = document.getElementById('root');

// Ensure the root element exists
if (!rootElement) {
  throw new Error('Failed to find the root element');
}

// Create a React root
const root = createRoot(rootElement);

// Render the App component to the root
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 