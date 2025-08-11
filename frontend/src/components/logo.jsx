import React from 'react';
import logo from '../assets/logo.png';

function Logo() {
  return (
<div className="flex justify-start  p-3 h-24 w-24">
<img src={logo} alt="image" />
</div>
  );
}

export default Logo;
