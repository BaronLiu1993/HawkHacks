import React from 'react'
import ReactDOM from 'react-dom/client'
import Land from './Land'
import './index.css'
import Nav from './Nav'
import App from './App'
import Memory from './Memory'
import { BrowserRouter, Route, Routes} from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
        <Nav />
        <Routes>
          <Route path="/" element ={<Land />} />
          <Route path="/app" element={<App />} />
          <Route path="/memory" element={<Memory />} />
        </Routes>
    
    </BrowserRouter>
  </React.StrictMode>,
)
