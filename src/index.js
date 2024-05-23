import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

// Register service worker outside of ReactDOM.render()
navigator.serviceWorker.register('/firebase-messaging-sw.js')
  .then(registration => {
    console.log('Service Worker registered');
  })
  .catch(error => {
    console.error('Service Worker registration failed:', error);
  });

  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
 
    <BrowserRouter basename="/PGHT-Web">
      <RecoilRoot>
        <App />
      </RecoilRoot>
    </BrowserRouter>,
);

reportWebVitals();
