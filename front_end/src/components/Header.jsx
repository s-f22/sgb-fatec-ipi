import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Profile from './Profile';  // Importa o componente Profile
import { Link } from 'react-router-dom';
import React, { useRef, useState } from 'react';
import { Menu } from 'primereact/menu';
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
      <Navbar expand='lg'>
        <div >
          <Navbar.Brand>
            <Navbar.Toggle style={{ marginLeft: 20 }} aria-controls="basic-navbar-nav" />
          </Navbar.Brand>
        </div>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav style={{
            position: 'absolute', backgroundColor: '#FFFFFF', marginLeft: '20px', border: '1px solid #CCC',
            borderRadius: '7px', width: '250px', height: '465px', display: 'flex', flexDirection: 'column', padding: '10px'
          }} class="d-lg-none">
            <Link to={'/'} style={{ textDecoration: 'none', color: '#345059', padding: '5px', border: '1px solid #EAEAEA', borderRadius: '7px' }}><i className="pi pi-home mr-2"></i>Home</Link>
            {/* Links relacionados a Temas */}
            <Link
              title="Dropdown"
              // id={`offcanvasNavbarDropdown-expand-${expand}`} 
              to="/sgb"
              style={{ textDecoration: 'none', color: '#495057', padding: '5px', border: '1px solid #EAEAEA', borderRadius: '7px' }}>
              <i className="pi pi-list mr-2"></i>Temas</Link>
            <Link to="/sgb/temas_listar" style={{ textDecoration: 'none', color: '#495057', padding: '5px', border: '1px solid #EAEAEA', borderRadius: '7px' }}>
              <i className="pi pi-arrow-right mr-2 ml-2"></i>Ver todos</Link>
            <Link to="/sgb/temas_cadastrar" style={{ textDecoration: 'none', color: '#495057', padding: '5px', border: '1px solid #EAEAEA', borderRadius: '7px' }}>
              <i className="pi pi-arrow-right mr-2 ml-2"></i>Cadastrar Tema</Link>
            {/* Links relacionados a Trabalhos */}
            <Link to={'/sgb'} style={{ textDecoration: 'none', color: '#495057', padding: '5px', border: '1px solid #EAEAEA', borderRadius: '7px' }}>
              <i className="pi pi-file-word mr-2"></i>Trabalhos</Link>
            <Link to="/sgb/trabalhos_listar" style={{ textDecoration: 'none', color: '#495057', padding: '5px', border: '1px solid #EAEAEA', borderRadius: '7px' }}> 
            <i className="pi pi-arrow-right mr-2 ml-2"></i>Ver todos</Link>
            <Link to="/sgb/trabalhos_cadastrar" style={{ textDecoration: 'none', color: '#495057', padding: '5px', border: '1px solid #EAEAEA', borderRadius: '7px' }}>
            <i className="pi pi-arrow-right mr-2 ml-2"></i>Cadastrar Trabalho</Link>
            <Link to="/sgb/trabalhos_avaliar" style={{ textDecoration: 'none', color: '#495057', padding: '5px', border: '1px solid #EAEAEA', borderRadius: '7px' }}>
            <i className="pi pi-arrow-right mr-2 ml-2"></i>Avaliar</Link>
            {/* Links relacionados a Bancas */}
            <Link to={'/sgb'} style={{ textDecoration: 'none', color: '#495057', padding: '5px', border: '1px solid #EAEAEA', borderRadius: '7px' }}>
              <i className="pi pi-calendar mr-2"></i>Bancas</Link>
            <Link to="/sgb/bancas_listar" style={{ textDecoration: 'none', color: '#495057', padding: '5px', border: '1px solid #EAEAEA', borderRadius: '7px' }}>
            <i className="pi pi-arrow-right mr-2 ml-2"></i>Ver todas</Link>
            <Link to="/sgb/bancas_cadastrar" style={{ textDecoration: 'none', color: '#495057', padding: '5px', border: '1px solid #EAEAEA', borderRadius: '7px' }}>
            <i className="pi pi-arrow-right mr-2 ml-2"></i>Cadastrar Banca</Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <div className="d-flex align-items-center" onClick={(event) => menuLeft.current.toggle(event)} aria-controls="popup_menu_left" aria-haspopup>
        {/* <Toast ref={toast}></Toast> */}
        <marquee behavior="scroll" direction="left" className="letreiro">
          Bem-vindo ao Sistema de gerenciamento de Bancas da Fatec Ipiranga!
        </marquee>
        <Menu model={items} popup ref={menuLeft} id="popup_menu_left" />
        <Profile />
      </div>
    </div>
  );
}



export default Header;
