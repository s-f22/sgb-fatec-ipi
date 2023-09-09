import React from 'react'
import Profile from './Profile'
import LogOut from './LogOut';

const Header = () => {
  return (
    <div style={{ backgroundColor: '#f8f9fa', padding: '10px 20px', borderBottom: '1px solid #ccc', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100px' }}>
      <img src={"https://i.ibb.co/Y3mM4wk/fatec-logo.png"} alt="Logo Fatec" style={{ width: '100px', borderRadius: '5px' }} />
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Profile />
        <LogOut />
      </div>
    </div>
  )
}

export default Header;
