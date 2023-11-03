// import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
// import NavDropdown from 'react-bootstrap/NavDropdown';
import Profile from './Profile';  // Importa o componente Profile
import LogOut from './LogOut';    // Importa o componente LogOut
import { Link } from 'react-router-dom';

function Header() {
  return (
    <div className='Header_Container'>
      <Navbar expand="lg" className="bg-body-tertiary">
        <div >
          <Navbar.Brand href="#home">
            {/* <img
              // src={"https://i.ibb.co/Y3mM4wk/fatec-logo.png"}
              alt="Logo Fatec"
              style={{ width: '100px', borderRadius: '5px' }}
            /> */}
          <Navbar.Toggle style={{marginLeft: 20}} aria-controls="basic-navbar-nav" />
          </Navbar.Brand>
        </div>
        <Navbar.Collapse id="basic-navbar-nav">
          {/* <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#link">Link</Nav.Link>
            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown>
          </Nav> */}
          <Nav style={{backgroundColor: 'blue'}} class="d-lg-none">
            <Link to={'/'}>Bem vindo!</Link>
            <Link to={'/signupinfo'}>Continuação do cadastro</Link>
            <Link to={'/sgb/trabalhos'}>trabalhos</Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <div className="d-flex align-items-center">
        <Profile />
        <LogOut />
      </div>
    </div>
  );
}

export default Header;
