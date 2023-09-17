import { React } from 'react';
import { Sidebar as ReactSidebar, Menu, MenuItem, SubMenu, sidebarClasses } from 'react-pro-sidebar';
import { Link } from 'react-router-dom';
import teste from '../assets/img/fatec_ipi.png'

const Sidebar = () => {






  return (
    // <div className="App_Sidebar d-none d-lg-block">
    <ReactSidebar className='d-none d-lg-block' rootStyles={{
      [`.${sidebarClasses.container}`]: {
        backgroundColor: 'gray',
        width: '35vh'
      },
    }}
    >
      <img src={teste} style={{width: 100}} alt="" />
      <Menu
        menuItemStyles={{
          button: ({ level, active, disabled }) => {
            // only apply styles on first level elements of the tree
            if (level === 0)
              return {
                color: disabled ? 'black' : '#black',
                backgroundColor: active ? 'green' : 'gray',
              };
            if (level === 1)
              return {
                color: disabled ? 'black' : 'black',
                backgroundColor: active ? 'green' : 'gray',
              };
          },
        }}
      >
        <MenuItem component={<Link to="/sgb" />}>Home</MenuItem>
        <MenuItem component={<Link to="/signupinfo" />}>Continuação do Cadastro</MenuItem>
        <SubMenu label={"Trabalhos"}>
          <MenuItem component={<Link to="/sgb/trabalhos" />}>Cadastrar Trabalho</MenuItem>
          <MenuItem component={<Link to="/sgb/trabalhos" />}>Meus Trabalhos</MenuItem>
        </SubMenu>
        <MenuItem component={<Link to="/e-commerce" />}>E-commerce</MenuItem>
      </Menu>
    </ReactSidebar>



    // </div>
  );
}

export default Sidebar;
