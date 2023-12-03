import { React } from "react";
import "../index.css";
import {
  Sidebar as ReactSidebar,
  Menu,
  MenuItem,
  SubMenu,
  sidebarClasses,
} from "react-pro-sidebar";
import { Link, useLocation } from "react-router-dom";
import teste from '../Assets/img/Logo_I.png';
import { useState } from "react";

const Sidebar = () => {
  const location = useLocation();
  const [selectedSubMenu, setSelectedSubMenu] = useState('Temas');
  const [selectedSubMenuW, setSelectedSubMenuW] = useState('Trabalhos');
  const [selectedSubMenuB, setSelectedSubMenuB] = useState('Bancas');
  
  
  return (
    <div className="background">
      <ReactSidebar
        className="d-none d-lg-block"
        rootStyles={{
          [`.${sidebarClasses.container}`]: {
            backgroundColor: "#345059",
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
                  color: active ? '#345059' : '#EAEAEA',
                  borderRadius: active ? '8px' : '8px',
                  fontWeight: active ? 600 : 600,
                  '&:hover': { borderRadius: 8, backgroundColor: '#EAEAEA', color: '#345059', fontWeight: 600 }
                };
              if (level === 1)
                return {
                  width: 172, height: 32,
                  color: disabled ? '#EAEAEA' : '#EAEAEA',
                  backgroundColor: active ? '#EAEAEA' : '#345059',
                  color: active ? '#345059' : '#EAEAEA',
                  borderRadius: active ? '8px' : '8px',
                  fontWeight: active ? 600 : 600,
                  marginLeft: 24, paddingLeft: 24,
                  '&:hover': { borderRadius: 8, backgroundColor: '#EAEAEA', color: '#345059', fontWeight: 600, }
                };
            },
          }}
        >
          <MenuItem
            component={<Link to="/sgb" />}
            active={location.pathname === "/sgb"}
            className="pb-2"
          >
            <i className="pi pi-th-large mr-2"></i>Painel
          </MenuItem>
          <SubMenu label={<span><i className="pi pi-list mr-2"></i>Temas</span>}
            opened={selectedSubMenu === "Temas"}
            active={location.pathname === "/sgb/temas_listar" || location.pathname === "/sgb/temas_cadastrar"}
            className="pb-2"
            >
            {selectedSubMenu === "Temas" && (
              <div className="selected-menu-line">
                <div className="selected-menu-line_turn_I"></div>
                <div className="selected-menu-line_turn_II"></div>
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

          <SubMenu label={<span><i className="pi pi-file-word mr-2"></i>Trabalhos</span>}
            opened={selectedSubMenuW === "Trabalhos"}
            active={location.pathname === "/sgb/trabalhos_listar" || location.pathname === "/sgb/trabalhos_cadastrar"}
            className="pb-2"
            >
            <MenuItem
              component={<Link to="/sgb/trabalhos_listar" />}
              active={location.pathname === "/sgb/trabalhos_listar"}
            >
              {selectedSubMenuW === "Trabalhos" && (
                <div className="selected-menu-line-w">
                  <div className="selected-menu-line_turn_I-w"></div>
                  <div className="selected-menu-line_turn_II-w"></div>
                  <div className="selected-menu-line_turn_III-w"></div>
                </div>
              )}
              Ver todos
            </MenuItem>

            <MenuItem
              component={<Link to="/sgb/trabalhos_cadastrar" />}
              active={location.pathname === "/sgb/trabalhos_cadastrar"}
            >
              Cadastrar Trabalho
            </MenuItem>
          </SubMenu>

          <SubMenu label={<span><i className="pi pi-calendar mr-2"></i>Bancas</span>}
            opened={selectedSubMenuB === "Bancas"}
            active={location.pathname === "/sgb/bancas_listar" || location.pathname === "/sgb/bancas_cadastrar"}
            >
            <MenuItem
              component={<Link to="/sgb/bancas_listar" />}
              active={location.pathname === "/sgb/bancas_listar"}
            >
              {selectedSubMenuB === "Bancas" && (
                <div className="selected-menu-line-b">
                  <div className="selected-menu-line_turn_I-b"></div>
                  <div className="selected-menu-line_turn_II-b"></div>
                </div>
              )}
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
