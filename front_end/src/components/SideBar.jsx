import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div style={{backgroundColor: 'gray', paddingLeft: 10, marginLeft: 50}} className="App_Sidebar">
      <ul>
        <li><Link to="/">Página Inicial</Link></li>
        <li><Link to="">Outra Rota</Link></li>
        <li><Link to="">Outra Rota</Link></li>
        <li><Link to="">Outra Rota</Link></li>
        <li><Link to="">Outra Rota</Link></li>
        <li><Link to="">Outra Rota</Link></li>
        <li><Link to="">Outra Rota</Link></li>
        <li><Link to="">Outra Rota</Link></li>
        {/* Adicione mais itens de menu conforme necessário */}
      </ul>
    </div>
  );
}

export default Sidebar;
