import { React } from "react";
import {
  Sidebar as ReactSidebar,
  Menu,
  MenuItem,
  SubMenu,
  sidebarClasses,
} from "react-pro-sidebar";
import { Link } from "react-router-dom";
import teste from "../assets/img/fatec_ipi.png";
import { useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  return (
    // <div className="App_Sidebar d-none d-lg-block">
    <ReactSidebar
      className="d-none d-lg-block"
      rootStyles={{
        [`.${sidebarClasses.container}`]: {
          backgroundColor: "gray",
          width: "35vh",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <img
        src={teste}
        style={{
          width: 100,
          display: "flex",
          alignSelf: "center",
          backgroundColor: "lightgray",
          padding: 10,
          borderRadius: 10,
        }}
        alt=""
      />
      <Menu
        menuItemStyles={{
          button: ({ level, active, disabled }) => {
            // only apply styles on first level elements of the tree
            if (level === 0)
              return {
                color: disabled ? "black" : "black",
                backgroundColor: active ? "green" : "gray",
              };
            if (level === 1)
              return {
                color: disabled ? "black" : "black",
                backgroundColor: active ? "green" : "gray",
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

    // </div>
  );
};

export default Sidebar;
