import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { registerAppInfo } from './services/appInfoService';

registerAppInfo();

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
