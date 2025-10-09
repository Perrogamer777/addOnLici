import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import { ClientProvider } from './contexts/ClientProvider';


// import '@zendeskgarden/css-bedrock'; 


import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ClientProvider>
      <App />
    </ClientProvider>
  </React.StrictMode>
);

