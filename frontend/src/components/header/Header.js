import React from 'react';
import { navigate } from 'hookrouter';

import './header.css';

const Header = () => {
  return (
    <header className='header'>
      <div className='banner'>
        <h2 onClick={() => navigate('/')}>TODO List</h2>
      </div>
    </header>
  );
};

export default Header;