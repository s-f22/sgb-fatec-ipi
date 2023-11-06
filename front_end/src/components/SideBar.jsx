import { React } from "react";
import {
  Sidebar as ReactSidebar,
  Menu,
  MenuItem,
  SubMenu,
  sidebarClasses,
} from "react-pro-sidebar";
import { Link } from "react-router-dom";
import teste from '../assets/img/Logo_I.png'
import { useLocation } from "react-router-dom";
import { useState } from "react";

const Sidebar = () => {
  const location = useLocation();
  const [selectedSubMenu, setSelectedSubMenu] = useState(null);
  
  return (
  <div className="background">
    <ReactSidebar
      className="d-none d-lg-block"
      rootStyles={{
        [`.${sidebarClasses.container}`]: {
          backgroundColor: "#345059",
          // width: "256px",
          height: "100%",
          display: "flex",
          alignItems: "center", 
          flexDirection: "column",
        },
      }}
    >
      <img
        src={teste}
        style={{ width: 172, height: 179, flexShrink: 0, }} alt="logo" 
      />
      <span style={{ width: 208, color: '#EAEAEA', border: '1px solid white', marginTop: '20px', marginBottom: '15px' }}></span>
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
        <MenuItem
          component={<Link to="/sgb" />}
          active={location.pathname === "/sgb"}
        >
          Home
        </MenuItem>

        <MenuItem
          component={<Link to="/signupinfo" />}
          active={location.pathname === "/signupinfo"}
        >
          Continuação do Cadastro 
        </MenuItem>

        <SubMenu label={"Temas"}>
        {selectedSubMenu === "temas" && (
            <div className="selected-menu-line">
              <div className="selected-menu-line_turn_I"></div>
              <div className="selected-menu-line_turn_II"></div>
              <div className="selected-menu-line_turn_III"></div>
            </div>
          )}
          <MenuItem
            component={<Link to="/sgb/temas_listar" />}
            active={location.pathname === "/sgb/temas_listar"}
          >
            Ver todos
          </MenuItem>

          <MenuItem
            component={<Link to="/sgb/temas_cadastrar" />}
            active={location.pathname === "/sgb/temas_cadastrar"}
          >
            Cadastrar Tema
          </MenuItem>
        </SubMenu>

        <SubMenu label={"Trabalhos"}>
          <MenuItem
            component={<Link to="/sgb/trabalhos_listar" />}
            active={location.pathname === "/sgb/trabalhos_listar"}
          >
            Ver todos
          </MenuItem>

          <MenuItem
            component={<Link to="/sgb/trabalhos_cadastrar" />}
            active={location.pathname === "/sgb/trabalhos_cadastrar"}
          >
            Cadastrar Trabalho
          </MenuItem>

          <MenuItem
            component={<Link to="/sgb/trabalhos_avaliar" />}
            active={location.pathname === "/sgb/trabalhos_avaliar"}
          >
            Avaliar
          </MenuItem>
        </SubMenu>

        <SubMenu label={"Bancas"}>
          <MenuItem
            component={<Link to="/sgb/bancas_listar" />}
            active={location.pathname === "/sgb/bancas_listar"}
          >
            Ver todas
          </MenuItem>
          <MenuItem
            component={<Link to="/sgb/bancas_cadastrar" />}
            active={location.pathname === "/sgb/bancas_cadastrar"}
          >
            Cadastrar Banca
          </MenuItem>
        </SubMenu>
      </Menu>
    </ReactSidebar>

  </div>
  );
};

export default Sidebar;
