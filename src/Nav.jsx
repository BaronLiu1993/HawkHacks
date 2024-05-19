import React from 'react'
import { Link } from 'react-router-dom';

function Nav() {
  return (
    <>
    <nav className = 'flex space-x-5 font-semibold justify-center font-Poppins m-5'>
      
        
          <Link to="/">Home</Link>
        
          <Link to="/app">Transcriber</Link>
        
          <a href = "http://127.0.0.1:5500/index.html">Video</a>
        
          <Link to="/memory">Memory</Link>
        
    </nav>
    </>
  )
}

export default Nav