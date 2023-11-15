import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Profile from './Profile';  // Importa o componente Profile
import { Link } from 'react-router-dom';
import React, { useRef, useState } from 'react';
import { Menu } from 'primereact/menu';
import { Toast } from 'primereact/toast';
import { useAuth0 } from '@auth0/auth0-react';

function Header() {

  const menuLeft = useRef(null);
  const toast = useRef(null);
  const [logoutClicked, setLogoutClicked] = useState(false);
  const { logout, isAuthenticated } = useAuth0();

  const handleLogout = () => {
   if (isAuthenticated) {
      logout();
    }
    console.log('logout clicked');
    setLogoutClicked(true);
  };
   const items = [
    {
      label: 'Options',
      items: [
        {
          label: 'Log out',
          icon: 'pi pi-arrow-circle-left',
          command: () => handleLogout(),
        },
      ]
    }
  ];
  
  return (
    <div className='Header_Container'>
      <Navbar expand="lg">
        <div >
          <Navbar.Brand href="#home">
            <Navbar.Toggle style={{ marginLeft: 20 }} aria-controls="basic-navbar-nav" />
          </Navbar.Brand>
        </div>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav style={{ backgroundColor: 'blue' }} class="d-lg-none">
            <Link to={'/'}>Bem vindo!</Link>
            <Link to={'/signupinfo'}>Continuação do cadastro</Link>
            <Link to={'/sgb/trabalhos'}>trabalhos</Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <div className="d-flex align-items-center" onClick={(event) => menuLeft.current.toggle(event)} aria-controls="popup_menu_left" aria-haspopup>
        <Toast ref={toast}></Toast>
          <Menu model={items} popup ref={menuLeft} id="popup_menu_left" />
        <Profile />
      </div>
    </div>
  );
}



export default Header;
