import { React } from 'react';
import { Sidebar as ReactSidebar, Menu, MenuItem, SubMenu, sidebarClasses } from 'react-pro-sidebar';
import { Link } from 'react-router-dom';
import teste from '../assets/img/Logo.png'
import { useState } from 'react';
import '../index.css'

const Sidebar = () => {

  const [selectedSubMenu, setSelectedSubMenu] = useState(null);
  return (
    <div className="background">
    <ReactSidebar className='d-none d-lg-block' rootStyles={{
      [`.${sidebarClasses.container}`]: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        color: 'white',
        width: 256,
        height: '100%',
        padding: 20,
        gap: 24,
        flexShrink: 0,
        backgroundColor: '#345059'
      },
    }}
    >
      <img src={teste} style={{ width: 172, height: 179, flexShrink: 0, }} alt="logo" />
      <span style={{ width: 208, color: '#EAEAEA', border: '1px solid white' }}></span>
      <Menu
        menuItemStyles={{
          button: ({ level, active, disabled }) => {
            // only apply styles on first level elements of the tree
            if (level === 0)
              return {
                width: 208, height: 40,
                color: disabled ? '#FFFFFF' : '#EAEAEA',
                backgroundColor: active ? '#EAEAEA' : '#345059',
                '&:hover': { borderRadius: 8, backgroundColor: '#EAEAEA', color: '#345059', fontWeight: 600 }
              };
            if (level === 1)
              return {
                width: 172, height: 32,
                color: disabled ? '#EAEAEA' : '#EAEAEA',
                backgroundColor: active ? '#345059' : '#345059',
                marginLeft: 24, paddingLeft: 24,
                '&:hover': { borderRadius: 8, backgroundColor: '#EAEAEA', color: '#345059', fontWeight: 600,}
              };
          },
        }}
      >
        <MenuItem component={<Link to="/sgb" />}>Home</MenuItem>
        <MenuItem component={<Link to="/signupinfo" />}>Continuação Cadastro</MenuItem>

        <SubMenu label={"Temas"} onMouseEnter={() => setSelectedSubMenu("temas")}>
          {selectedSubMenu === "temas" && (
            <div className="selected-menu-line">
              <div className="selected-menu-line_turn_I"></div>
              <div className="selected-menu-line_turn_II"></div>
              <div className="selected-menu-line_turn_III"></div>
            </div>
          )}
          <MenuItem component={<Link to="/sgb/trabalhos_listagem" />}>Ver todos</MenuItem>
          <MenuItem component={<Link to="/sgb/trabalhos" />}>Cadastrar Tema</MenuItem>
          <MenuItem component={<Link to="/sgb/trabalhos" />}>Meus Temas</MenuItem>
        </SubMenu>
        <MenuItem component={<Link to="/e-commerce" />}>E-commerce</MenuItem>
      </Menu>
    </ReactSidebar >
    </div>
  );
}

export default Sidebar;
