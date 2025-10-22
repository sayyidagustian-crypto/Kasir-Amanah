import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("❌ Root element #root tidak ditemukan. Pastikan index.html memiliki <div id='root'></div>");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(registration => {
      console.log('✅ Service Worker terdaftar dengan scope:', registration.scope);
    }).catch(error => {
      console.log('❌ Pendaftaran Service Worker gagal:', error);
    });
  });
}

/**
 * -----------------------------------------------------------
 * All praise and thanks are due to Allah.
 *
 * Powered by Google, Gemini, and AI Studio.
 * Development assisted by OpenAI technologies.
 *
 * © 2025 SAT18 Official
 * For suggestions & contact: sayyidagustian@gmail.com
 * -----------------------------------------------------------
 */